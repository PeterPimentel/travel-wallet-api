import { Travel } from '@prisma/client';

import prisma from '../config/db';
import { AuthError } from '../util/Error';
import { ERROR_MESSAGES } from '../util/errorUtil';
import { sanitizeTravel } from '../util/sanitizeUtil';
import { isValidTravel } from '../util/validatorUtil';

export const create = async (ownerId: number, travel: Omit<Travel, 'id'>) => {
  if (!isValidTravel(travel)) {
    //Missing data
    throw new AuthError(ERROR_MESSAGES.MISSING_FIELDS, 400);
  }

  const newTravel = await prisma.travel.create({
    data: {
      name: travel.name,
      cover: travel.cover,
      ownerId,
    },
  });

  return newTravel;
};

export const find = async (ownerId: number) => {
  const travels = await prisma.travel.findMany({
    where: {
      ownerId,
    },
    include: {
      expenses: {
        orderBy: {
          date: 'desc',
        },
      },
    },
  });

  return travels;
};

export const findOne = async (ownerId: number, travelId: number) => {
  const travels = await prisma.travel.findFirst({
    where: {
      id: travelId,
      ownerId,
    },
    include: {
      expenses: {
        orderBy: {
          date: 'desc',
        },
      },
    },
  });

  return travels;
};

export const update = async (ownerId: number, travelId: number, data: Travel) => {
  const storedTravel = await prisma.travel.findUnique({
    where: {
      id: travelId,
    },
  });

  if (!storedTravel) {
    throw new AuthError(ERROR_MESSAGES.NOT_FOUND('travel'), 400);
  }

  if (storedTravel?.ownerId !== ownerId) {
    throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403);
  }

  if (!isValidTravel(data)) {
    //Missing data
    throw new AuthError(ERROR_MESSAGES.MISSING_FIELDS, 400);
  }

  const travels = await prisma.travel.update({
    where: {
      id: travelId,
    },
    data: sanitizeTravel('UPDATE', data),
  });

  return travels;
};

export const remove = async (ownerId: number, travelId: number) => {
  const storedTravel = await prisma.travel.findUnique({
    where: {
      id: travelId,
    },
  });

  if (!storedTravel) {
    throw new AuthError(ERROR_MESSAGES.NOT_FOUND('travel'), 400);
  }

  if (storedTravel?.ownerId !== ownerId) {
    throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403);
  }

  const updatedTravel = await prisma.travel.update({
    where: {
      id: travelId,
    },
    data: {
      expenses: {
        deleteMany: {},
      },
    },
  });

  await prisma.travel.delete({
    where: {
      id: travelId,
    },
  });

  return updatedTravel;
};
