import { User } from '@prisma/client';
import prisma from '../config/db';
import { UserFindQuery } from '../types/QueryType';

export const findById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      email: true,
      username: true,
      id: true,
      password: false,
    },
  });

  return user;
};

export const findOne = async (userQuery: Partial<UserFindQuery>, withCredential: boolean = false) => {
  const user = await prisma.user.findUnique({
    where: {
      ...userQuery,
    },
    select: {
      email: true,
      username: true,
      id: true,
      password: withCredential,
    },
  });

  return user;
};

export const create = async (user: Omit<User, 'id'>) => {
  const newUser = await prisma.user.create({
    data: {
      username: user.username,
      email: user.email,
      password: user.password,
    },
    select: {
      email: true,
      username: true,
      id: true,
    },
  });

  return newUser;
};

export const remove = async (id: number) => {
  const data = await prisma.user.delete({
    where: {
      id,
    },
  });

  return data;
};
