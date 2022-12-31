import { User } from '@prisma/client';
import prisma from '../config/db';
import { UserFindQuery } from '../types/QueryType';

export const findOne = async (userQuery: Partial<UserFindQuery>, withCredential: boolean = false) => {
  const user = await prisma.user.findFirst({
    where: {
      ...userQuery,
    },
    select: {
      email: true,
      username: true,
      id: true,
      password: withCredential,
      activationToken: true,
      active: true,
      role: true,
    },
  });

  return user;
};

export const create = async (user: Omit<User, 'id' | 'createdAt' | 'active' | 'role'>) => {
  const newUser = await prisma.user.create({
    data: {
      username: user.username,
      email: user.email,
      password: user.password,
      activationToken: user.activationToken,
    },
    select: {
      email: true,
      username: true,
      id: true,
      activationToken: true,
      active: true,
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
    await prisma.sharedTravel.deleteMany({
      where: {
        travelOwnerId: userId
      },
    });
  }

  await prisma.sharedTravel.deleteMany({
    where: {
      userId: userId
    },
  });

  await prisma.location.deleteMany({
    where: {
      ownerId: userId
    },
  });

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


export const update = async (userId: number, user: Omit<User, 'id' | 'createdAt' | 'password' | 'role'>) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      username: user.username,
      email: user.email,
      activationToken: user.activationToken,
      active: user.active
    },
  });

  return updatedUser;
};

export const updatePassword = async (userId: number, password: string) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      password,
    },
  });

  return updatedUser;
};