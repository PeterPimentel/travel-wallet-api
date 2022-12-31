import { Expense, Location } from '@prisma/client';

import ApiError, { AuthError } from '../util/Error';
import { ERROR_CODES, ERROR_MESSAGES } from '../util/errorUtil';
import logger from '../util/logUtil';

import { isValidExpense } from '../util/validator/expenseValidator';
import { isSameLocation } from '../util/validator/locationValidator';

import * as expenseModel from "../model/expenseModel"
import * as sharedTravelModel from "../model/sharedTravelModel"
import * as travelModel from '../model/travelModel';

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

export const create = async (userId: number, expense: Omit<ExpenseRequest, 'id'>) => {
  const validator = isValidExpense('CREATE', expense)
  if (!validator.valid) {
    throw new ApiError(ERROR_MESSAGES.MISSING_FIELDS(validator.fields), 400);
  }

  const travel = await travelModel.findByIdLean(expense.travelId);
  if (!travel) {
    throw new AuthError(ERROR_MESSAGES.ENTITY_NOT_FOUND('travel'), 404);
  }

  const sharedTravel = await sharedTravelModel.findFirstLean({ travelId: travel.id, userId })

  if (!sharedTravel && travel?.ownerId !== userId) {
    throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403, ERROR_CODES.forbidden);
  }

  let expenseLocation = null;

  if (expense.location) {
    expenseLocation = await locationService.create(userId, expense.travelId, expense.location);
  }

  const locationId = expenseLocation ? expenseLocation.id : null
  const newExpense = await expenseModel.create(userId, expense, locationId)

  return newExpense;
};

export const update = async (userId: number, expenseId: number, data: ExpenseRequest) => {
  const storedExpense = await expenseModel.findOne(expenseId);

  if (!storedExpense) {
    throw new AuthError(ERROR_MESSAGES.ENTITY_NOT_FOUND('expense'), 404);
  }

  const sharedTravel = await sharedTravelModel.findFirstLean({ travelId: storedExpense.travelId, userId })

  if (!sharedTravel && storedExpense?.userId !== userId) {
    throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403, ERROR_CODES.forbidden);
  }

  const validator = isValidExpense('UPDATE', data)

  if (!validator.valid) {
    throw new ApiError(ERROR_MESSAGES.MISSING_FIELDS(validator.fields), 400);
  }

  const locationId = await updateExpenseLocation(data.location, storedExpense.location, userId, storedExpense.travelId)

  const expense = await expenseModel.update(expenseId, data, locationId)

  return expense;
};

export const remove = async (userId: number, expenseId: number) => {
  const storedExpense = await expenseModel.findOne(expenseId);

  if (!storedExpense) {
    throw new ApiError(ERROR_MESSAGES.ENTITY_NOT_FOUND('expense'), 404);
  }
  const sharedTravel = await sharedTravelModel.findFirstLean({ travelId: storedExpense.travelId, userId })

  if (!sharedTravel && storedExpense?.userId !== userId) {
    throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403, ERROR_CODES.forbidden);
  }

  const removedItem = await expenseModel.remove(expenseId)

  if (storedExpense.locationId) {
    await locationService.remove(userId, storedExpense.locationId)
  }

  return removedItem;
};

export const bulkRemove = async (travelId: number) => {
  return await expenseModel.bulkRemove(travelId)
};