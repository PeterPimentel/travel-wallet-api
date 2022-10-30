import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { TokenData } from '../types/RequestType';
import { AuthError } from '../util/Error';
import { ERROR_MESSAGES } from '../util/errorUtil';

const SALT_ROUNDS = 12;
const PRIVATE_KEY = process.env.JWT_KEY as string;

export const generateRandomId = () => {
  return uuidv4()
}

export const hash = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const compare = async (password: string, storedPassword: string) => {
  return await bcrypt.compare(password, storedPassword);
};

export const generateToken = async ({ id, username, active }: TokenData): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id, username, active },
      PRIVATE_KEY,
      {
        expiresIn: '6h',
        algorithm: 'HS256',
      },
      function (error, token) {
        if (error) {
          reject(error);
        }
        if (token) {
          return resolve(token);
        } else {
          throw new AuthError(ERROR_MESSAGES.UNEXPECTED_ERROR, 500);
        }
      },
    );
  });
};

const verifyToken = async (token: string): Promise<TokenData | null> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, PRIVATE_KEY, function (error, decoded) {
      if (error) {
        reject(error);
      }
      if (token) {
        resolve(decoded as TokenData);
      } else {
        throw new AuthError(ERROR_MESSAGES.UNEXPECTED_ERROR, 500);
      }
    });
  });
};

export const validateToken = async (authorization: string | undefined) => {
  if (authorization) {
    const bearer = authorization.split(' ');
    const decoded = await verifyToken(bearer[1]);

    return decoded;
  } else {
    throw new AuthError(ERROR_MESSAGES.NO_TOKEN, 401);
  }
};
