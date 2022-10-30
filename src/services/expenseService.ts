import { Expense, Location } from '@prisma/client';

import prisma from '../config/db';
import { parseDate } from '../util/dateUtil';
import ApiError, { AuthError } from '../util/Error';
import { ERROR_MESSAGES } from '../util/errorUtil';
import logger from '../util/logUtil';
import { sanitizeUpdateExpense } from '../util/sanitizeUtil';
import { isValidExpense } from '../util/validator/expenseValidator';
import { isSameLocation } from '../util/validator/locationValidator';
import * as locationService from './locationService';

const NAME_SPACE = 'expense-service';

type ExpenseRequest = Expense & {
  location?: Location
};

const updateExpenseLocation = async (data: Location | undefined, storedLocation: Location | null, userId: number, travelId: number): Promise<number | null> => {
  const hasStoredLocation = !!storedLocation;
  const hasIncomingLocation = !!data;

  if (!hasIncomingLocation && !hasStoredLocation) {
    logger.info(NAME_SPACE, 'Location not setted')
    return null
  }

  if (!hasIncomingLocation && hasStoredLocation) {
    logger.info(NAME_SPACE, `Deleting location: ${storedLocation.id}`)
    await locationService.remove(userId, storedLocation.id);

    return null
  }

  if (hasIncomingLocation && !hasStoredLocation) {
    logger.info(NAME_SPACE, `Creating location`)
    const createdLocation = await locationService.create(userId, travelId, data);

    return createdLocation.id
  }

  if (hasIncomingLocation && hasStoredLocation) {
    const match = isSameLocation(data, storedLocation)
    if (match) {
      logger.info(NAME_SPACE, `Same location as stored`)
      return storedLocation.id
    } else {
      logger.info(NAME_SPACE, `Updating location: ${storedLocation.id}`)
      const updatedLocation = await locationService.update(userId, storedLocation.id, data);
      return updatedLocation.id
    }
  }

  return null
}

const findOne = async (expenseId: number) => {
  const storedExpense = await prisma.expense.findUnique({
    where: {
      id: expenseId,
    },
    include: {
      location: true,
    }
  });

  return storedExpense
}

export const create = async (userId: number, expense: Omit<ExpenseRequest, 'id'>) => {
  const validator = isValidExpense('CREATE', expense)
  if (!validator.valid) {
    throw new ApiError(ERROR_MESSAGES.MISSING_FIELDS(validator.fields), 400);
  }

  let expenseLocation = null;

  if (expense.location) {
    expenseLocation = await locationService.create(userId, expense.travelId, expense.location);
  }

  const expenseDate = parseDate(expense.date as unknown as string);

  const newExpense = await prisma.expense.create({
    data: {
      title: expense.title,
      date: expenseDate,
      payment: expense.payment,
      type: expense.type,
      travelId: expense.travelId,
      value: expense.value,
      description: expense.description,
      userId,
      locationId: expenseLocation ? expenseLocation.id : null
    },
    include: {
      location: true
    }
  });

  return newExpense;
};

export const update = async (userId: number, expenseId: number, data: ExpenseRequest) => {
  const storedExpense = await findOne(expenseId);

  if (!storedExpense) {
    throw new AuthError(ERROR_MESSAGES.ENTITY_NOT_FOUND('expense'), 404);
  }
  if (storedExpense?.userId !== userId) {
    throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403);
  }
  const validator = isValidExpense('UPDATE', data)
  if (!validator.valid) {
    throw new ApiError(ERROR_MESSAGES.MISSING_FIELDS(validator.fields), 400);
  }

  const locationId = await updateExpenseLocation(data.location, storedExpense.location, userId, storedExpense.travelId)

  const expense = await prisma.expense.update({
    where: {
      id: expenseId,
    },
    data: sanitizeUpdateExpense(data, locationId),
    include: {
      location: true,
    }
  });

  return expense;
};

export const remove = async (userId: number, expenseId: number) => {
  const storedExpense = await findOne(expenseId);

  if (!storedExpense) {
    throw new ApiError(ERROR_MESSAGES.ENTITY_NOT_FOUND('expense'), 404);
  }
  if (storedExpense.userId !== userId) {
    throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403);
  }

  const removedItem = await prisma.expense.delete({
    where: {
      id: expenseId,
    },
  });

  if (storedExpense.locationId) {
    await locationService.remove(userId, storedExpense.locationId)
  }

  return removedItem;
};

export const bulkRemove = async (travelId: number) => {
  return prisma.expense.deleteMany({
    where: {
      travelId,
    },
  });
};