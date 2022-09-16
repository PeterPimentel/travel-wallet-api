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

export const remove = async (userId: number) => {
  const createdTravels = await prisma.travel.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      expenses: true,
    },
  });

  const travelIds = createdTravels.map((travel) => travel.id);

  const expenseIds = createdTravels.reduce((acc: number[], curr) => {
    const expenses: number[] = curr.expenses.map((exp) => exp.id);
    return acc.concat(...expenses);
  }, []);

  if (expenseIds.length) {
    await prisma.expense.deleteMany({
      where: {
        id: {
          in: expenseIds,
        },
      },
    });
  }

  if (travelIds.length) {
    await prisma.travel.deleteMany({
      where: {
        id: {
          in: travelIds,
        },
      },
    });
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return '';
};
