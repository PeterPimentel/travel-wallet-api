import { User } from '@prisma/client';

import ApiError from '../util/Error';
import { ERROR_MESSAGES } from '../util/errorUtil';
import logger from '../util/logUtil';

import * as cryptService from './cryptService';
import * as userService from './userService';

const NAME_SPACE = "auth-service";

export const signup = async (newUser: Omit<User, 'id'>) => {
  const encryptedPass = await cryptService.hash(newUser.password);

  const user = await userService.create({
    username: newUser.username,
    email: newUser.email,
    password: encryptedPass,
  });

  const token = await cryptService.generateToken({ id: user.id, username: user.username });

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
  logger.info(NAME_SPACE, "signin step")
  const user = await userService.findOne({ email }, true);

  if (user) {
    const pwdMatch = await cryptService.compare(password, user.password);
    if (pwdMatch) {
      const token = await cryptService.generateToken({ id: user.id, username: user.username });
      if (token) {
        return {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
          token,
        };
      }
    }
  }
  logger.warning(NAME_SPACE, "signin step - user not found")
  throw new ApiError(ERROR_MESSAGES.INVALID_PWD, 400);
};
