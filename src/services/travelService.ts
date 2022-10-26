import { Travel } from '@prisma/client';

import prisma from '../config/db';
import { AuthError } from '../util/Error';
import { ERROR_MESSAGES } from '../util/errorUtil';
import { sanitizeTravel } from '../util/sanitizeUtil';
import { isValidTravel } from '../util/validator/travelValidator';
import { bulkRemove as locationBulkRemove } from './locationService';
import { bulkRemove as expenseBulkRemove } from './expenseService';

export const create = async (ownerId: number, travel: Omit<Travel, 'id'>) => {
  const validator = isValidTravel(travel)
  if (!validator.valid) {
    throw new AuthError(ERROR_MESSAGES.MISSING_FIELDS(validator.fields), 400);
  }

  const newTravel = await prisma.travel.create({
    data: {
      name: travel.name,
      cover: travel.cover,
      ownerId,
      budget: travel.budget ? travel.budget : null,
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
        include: {
          location: true
        }
      },
    },
    orderBy: {
      createdAt: 'desc',
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
        include: {
          location: true
        }
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
    throw new AuthError(ERROR_MESSAGES.ENTITY_NOT_FOUND('travel'), 400);
  }

  if (storedTravel?.ownerId !== ownerId) {
    throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403);
  }

  const validator = isValidTravel(data)
  if (!validator.valid) {
    throw new AuthError(ERROR_MESSAGES.MISSING_FIELDS(validator.fields), 400);
  }

  const travel = await prisma.travel.update({
    where: {
      id: travelId,
    },
    data: sanitizeTravel('UPDATE', data),
  });

  return travel;
};

export const remove = async (ownerId: number, travelId: number) => {
  const storedTravel = await prisma.travel.findUnique({
    where: {
      id: travelId,
    },
  });

  if (!storedTravel) {
    throw new AuthError(ERROR_MESSAGES.ENTITY_NOT_FOUND('travel'), 400);
  }

  if (storedTravel?.ownerId !== ownerId) {
    throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403);
  }

  await expenseBulkRemove(travelId)
  await locationBulkRemove(travelId)

  const removedItem = await prisma.travel.delete({
    where: {
      id: travelId,
    },
  });

  return removedItem;
};
