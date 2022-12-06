import { User } from '@prisma/client';

import ApiError, { AuthError } from '../util/Error';
import { ERROR_MESSAGES, ERROR_CODES } from '../util/errorUtil';
import logger from '../util/logUtil';
import { ROLE } from '../util/constants';
import { RoleAccessType, Status } from '../types/CommonType';

import * as cryptService from './cryptService';
import * as userService from './userService';
import * as mailService from './mailService';
import * as resetTokenService from './resetTokenService';

const NAME_SPACE = 'auth-service';

export const signup = async (newUser: Omit<User, 'id'>) => {
  logger.info(NAME_SPACE, 'signup step');

  const existentEmail = await userService.findOne({ email: newUser.email }, false);
  const existentUsername = await userService.findOne({ username: newUser.username }, false);

  if (existentEmail) {
    throw new ApiError(ERROR_MESSAGES.EMAIL_IN_USE, 400, ERROR_CODES.email_in_use);
  }
  if (existentUsername) {
    throw new ApiError(ERROR_MESSAGES.USERNAME_IN_USE, 400, ERROR_CODES.username_in_use);
  }

  const encryptedPass = await cryptService.hash(newUser.password);
  const randomId = cryptService.generateRandomId()

  const user = await userService.create({
    username: newUser.username,
    email: newUser.email,
    password: encryptedPass,
    activationToken: randomId,
  });

  await mailService.sendActivationAccountEmail(newUser.email, randomId)

  const token = await cryptService.generateToken({
    id: user.id,
    username: user.username,
    active: false,
    role: ROLE.user
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    token,
  };
};

export const signin = async (email: string, password: string) => {
  logger.info(NAME_SPACE, 'signin step');
  const user = await userService.findOne({ email }, true);

  if (user) {
    const pwdMatch = await cryptService.compare(password, user.password);
    if (pwdMatch) {
      const token = await cryptService.generateToken({
        id: user.id,
        username: user.username,
        active: user.active,
        role: user.role as RoleAccessType
      });
      if (token) {
        return {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            active: user.active,
          },
          token,
        };
      }
    }
  }
  logger.warning(NAME_SPACE, 'signin step - user not found');
  throw new ApiError(ERROR_MESSAGES.INVALID_PWD, 400, ERROR_CODES.invalid_pwd);
};

export const signupConfirm = async (token: string): Promise<{ status: Status, code: string }> => {
  logger.info(NAME_SPACE, 'signup confirmation');
  const user = await userService.findOne({ activationToken: token });

  if (!user) {
    logger.warning(NAME_SPACE, 'user/token not found');

    return {
      status: "error",
      code: ERROR_CODES.token_not_found
    }
  }

  await userService.update(user.id, {
    username: user.username,
    email: user.email,
    activationToken: "",
    active: true,
  });

  logger.info(NAME_SPACE, 'user account activated');

  return {
    status: "success",
    code: ERROR_CODES.activation_success
  }
};

export const activationRetry = async (userId: number) => {
  logger.info(NAME_SPACE, 'activationRetry');

  const storedUser = await userService.findOne({ id: userId }, false);

  if (!storedUser) {
    throw new ApiError(ERROR_MESSAGES.ENTITY_NOT_FOUND("User"), 400, ERROR_CODES.user_not_found);
  }

  if (storedUser?.active) {
    throw new AuthError(ERROR_MESSAGES.ACTIVATED_ACCOUNT, 400, ERROR_CODES.account_activated);
  }

  const randomId = cryptService.generateRandomId()

  await userService.update(storedUser.id, {
    username: storedUser.username,
    email: storedUser.email,
    activationToken: randomId,
    active: false,
  });

  await mailService.sendActivationAccountEmail(storedUser.email, randomId)

  return {
    user: {
      email: storedUser.email,
    },
  };
};

export const passwordResetRequest = async (email: string) => {
  const storedUser = await userService.findOne({ email: email });
  if (!storedUser) {
    throw new AuthError(ERROR_MESSAGES.ENTITY_NOT_FOUND("User"), 400, ERROR_CODES.user_not_found);
  }

  const code = await resetTokenService.createToken(email)

  await mailService.sendPasswordResetCodeEmail(storedUser.email, code)

  return null
}

export const passwordUpdate = async (email: string, resetCode: string, password: string) => {
  const storedUser = await userService.findOne({ email: email });
  if (!storedUser) {
    throw new AuthError(ERROR_MESSAGES.ENTITY_NOT_FOUND("User"), 400, ERROR_CODES.user_not_found);
  }

  const isValid = await resetTokenService.validateToken(resetCode, email)
  if (isValid) {
    const newPassword = await cryptService.hash(password);

    await resetTokenService.removeToken(email)

    await userService.updatePassword(storedUser.id, newPassword);
    return null
  }

  throw new AuthError(ERROR_MESSAGES.UNEXPECTED_ERROR, 400, ERROR_CODES.unexpected_error);
}