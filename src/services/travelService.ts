import { Travel } from '@prisma/client';

import { AuthError } from '../util/Error';
import { ERROR_CODES, ERROR_MESSAGES } from '../util/errorUtil';
import { isValidTravel } from '../util/validator/travelValidator';

import { bulkRemove as locationBulkRemove } from './locationService';

import * as expenseModel from '../model/expenseModel';
import * as travelModel from '../model/travelModel';
import * as sharedTravelModel from '../model/sharedTravelModel';

type TravelListResponse = Travel & {
  shared?: boolean;
}

export const create = async (ownerId: number, travel: Omit<Travel, 'id'>) => {
  const validator = isValidTravel(travel)
  if (!validator.valid) {
    throw new AuthError(ERROR_MESSAGES.MISSING_FIELDS(validator.fields), 400);
  }

  const newTravel = await travelModel.create(ownerId, travel)

  return newTravel;
};

export const find = async (userId: number) => {
  const travelsPromise = travelModel.find(userId) as Promise<TravelListResponse[]>
  const sharedTravelsPromise = sharedTravelModel.findMany({ userId }) as Promise<TravelListResponse[]>

  const [travels, sharedTravels] = await Promise.all([travelsPromise, sharedTravelsPromise])

  const userTravels = travels.map<TravelListResponse>(travel => {
    travel.shared = false;
    return travel;
  })
  const shared = sharedTravels.map<TravelListResponse>(travel => {
    travel.shared = true;
    return travel;
  })

  return userTravels.concat(shared);
};

export const update = async (ownerId: number, travelId: number, data: Travel) => {
  const storedTravel = await travelModel.findByIdLean(travelId)

  if (!storedTravel) {
    throw new AuthError(ERROR_MESSAGES.ENTITY_NOT_FOUND('travel'), 404);
  }

  if (storedTravel?.ownerId !== ownerId) {
    throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403, ERROR_CODES.forbidden);
  }

  const validator = isValidTravel(data)
  if (!validator.valid) {
    throw new AuthError(ERROR_MESSAGES.MISSING_FIELDS(validator.fields), 400);
  }

  const travel = await travelModel.update(travelId, data);

  return travel;
};

export const remove = async (ownerId: number, travelId: number) => {
  const storedTravel = await travelModel.findByIdLean(travelId);

  if (!storedTravel) {
    throw new AuthError(ERROR_MESSAGES.ENTITY_NOT_FOUND('travel'), 404);
  }

  if (storedTravel?.ownerId !== ownerId) {
    throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403);
  }

  await sharedTravelModel.bulkRemove(travelId)
  await expenseModel.bulkRemove(travelId)
  await locationBulkRemove(travelId)

  const removedItem = await travelModel.remove(travelId)

  return removedItem;
};