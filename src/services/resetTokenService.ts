import prisma from '../config/db';
import ApiError, { AuthError } from '../util/Error';
import { ERROR_CODES, ERROR_MESSAGES } from '../util/errorUtil';
import logger from '../util/logUtil';
import { addToDate, isDateAfter } from '../util/dateUtil';

import * as cryptService from './cryptService';

const NAME_SPACE = 'reset-token-service';

export const validateToken = async (token: string, email: string): Promise<boolean> => {
    logger.info(NAME_SPACE, 'validateToken');

    const storedToken = await prisma.resetToken.findUnique({
        where: {
            email,
        }
    });

    if (!storedToken) {
        logger.info(NAME_SPACE, 'validateToken - no password reset requested from user');

        throw new ApiError(ERROR_MESSAGES.PASSWORD_RESET_NO_REQUEST, 400, ERROR_CODES.password_reset_no_request);
    }

    const isAfter = isDateAfter(new Date(), storedToken.expiresIn)
    if (isAfter) {
        logger.info(NAME_SPACE, 'validateToken - experired token used');

        throw new ApiError(ERROR_MESSAGES.PASSWORD_RESET_EXPIRED_CODE, 400, ERROR_CODES.password_reset_expired_code);
    }

    const match = await cryptService.compare(token, storedToken.token)
    if (!match) {
        logger.info(NAME_SPACE, 'validateToken - invalid token provided');

        throw new AuthError(ERROR_MESSAGES.PASSWORD_RESET_INVALID_CODE, 400, ERROR_CODES.password_reset_invalid_code);
    }

    return true
};

export const createToken = async (email: string) => {
    logger.info(NAME_SPACE, 'createToken');

    const storedToken = await prisma.resetToken.findUnique({
        where: {
            email,
        }
    });

    const randomCode = cryptService.generateRandomCode()
    const criptCode = await cryptService.hash(randomCode)
    const expiresIn = addToDate(new Date(), { minutes: 30 })

    if (!storedToken) {
        await prisma.resetToken.create({
            data: {
                email,
                token: criptCode,
                expiresIn,
                retries: 1
            }
        });

        return randomCode
    }

    const lastUpdate = addToDate(storedToken.updatedAt, { hours: 24 })
    const has24hAfterLastUpdate = isDateAfter(new Date(), lastUpdate)

    if (storedToken.retries >= 4 && !has24hAfterLastUpdate) {
        throw new AuthError(
            ERROR_MESSAGES.PASSWORD_RESET_LIMIT_EXCEEDED,
            429, // Too many requests
            ERROR_CODES.password_reset_limit_exceeded
        );
    } else {
        await prisma.resetToken.update({
            where: {
                id: storedToken.id,
            },
            data: {
                email,
                token: criptCode,
                expiresIn,
                retries: storedToken.retries + 1
            }
        })

        return randomCode
    }
};

export const removeToken = async (email: string) => {
    await prisma.resetToken.delete({
        where: {
            email
        }
    });
}