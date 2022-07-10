import { User } from '@prisma/client';

import ApiError from '../util/Error';
import { ERROR_MESSAGES } from '../util/errorUtil';

import * as cryptService from './cryptService';
import * as userService from './userService';

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

  throw new ApiError(ERROR_MESSAGES.INVALID_PWD, 400);
};
