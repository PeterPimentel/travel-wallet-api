import { Location } from '@prisma/client';

import prisma from '../config/db';
import { PlaceApiRequest, PlaceApiResponse } from '../types/LocationType';
import ApiError, { AuthError } from '../util/Error';
import { ERROR_MESSAGES } from '../util/errorUtil';
import { placeFetcher } from '../util/fetchers/placeFetcher';
import { sanitizeLocation } from '../util/sanitizeUtil';
import { isValidLocation, isValidPlaceResponse, placesReduceFromApi } from '../util/validator/locationValidator';

export const getPlaces = async (body: PlaceApiRequest) => {
  if (!body.query || body.query.length < 3) {
    throw new ApiError(ERROR_MESSAGES.PREFIX_REQUIRED('city'), 400);
  }

  const response = await placeFetcher<PlaceApiResponse>(body.query);

  if (!isValidPlaceResponse(response)) {
    throw new ApiError(ERROR_MESSAGES.ENTITY_NOT_FOUND('City'), 404);
  }

  const places = response.data.filter((city) => city.type === 'locality');

  return placesReduceFromApi(places);
};

export const create = async (userId: number, travelId: number, location: Omit<Location, 'id'>) => {
  const validation = isValidLocation("CREATE", location)
  if (!validation.valid) {
    throw new ApiError(ERROR_MESSAGES.MISSING_FIELDS(validation.fields), 400);
  }

  const newLocation = await prisma.location.create({
    data: {
      countryCode: location.countryCode,
      countryName: location.countryName,
      label: location.label,
      cityName: location.cityName,
      cityLat: location.cityLat,
      cityLong: location.cityLong,
      region: location.region,
      ownerId: userId,
      travelId: travelId,
    },
  });

  return newLocation;
};

export const remove = async (userId: number, locationId: number) => {
  const storedLocation = await prisma.location.findUnique({
    where: {
      id: locationId
    }
  })

  if (!storedLocation) {
    return null
  }

  if (storedLocation?.ownerId !== userId) {
    return null
  }

  const removedItem = await prisma.location.delete({
    where: {
      id: locationId,
    },
  });

  return removedItem

}

export const bulkRemove = async (travelId: number) => {
  return prisma.location.deleteMany({
    where: {
      travelId,
    },
  });
};

export const update = async (userId: number, locationId: number, data: Location) => {
  const storedLocation = await prisma.location.findUnique({
    where: {
      id: locationId
    }
  })

  if (!storedLocation) {
    throw new ApiError(ERROR_MESSAGES.ENTITY_NOT_FOUND('expense'), 407);
  }
  if (storedLocation?.ownerId !== userId) {
    throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403);
  }
  const validation = isValidLocation("UPDATE", storedLocation)
  if (!validation.valid) {
    throw new ApiError(ERROR_MESSAGES.MISSING_FIELDS(validation.fields), 400);
  }

  const location = await prisma.location.update({
    where: {
      id: locationId,
    },
    data: sanitizeLocation(data),
  });

  return location;
};