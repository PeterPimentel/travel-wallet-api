import { Travel, Expense, Location } from '@prisma/client';
import { parseDate } from './dateUtil';

export const sanitizeTravel = (operation: 'CREATE' | 'UPDATE', data: Travel): Partial<Travel> => {
  if (operation === 'CREATE') {
    return {
      name: data.name,
      cover: data.cover,
      ownerId: data.ownerId,
      budget: data.budget ? data.budget : null,
    };
  } else {
    return {
      name: data.name,
      cover: data.cover,
      budget: data.budget ? data.budget : null,
    };
  }
};

export const sanitizeUpdateExpense = (data: Expense, locationId: number | null): Partial<Expense> => {
  const expenseDate = parseDate(data.date as unknown as string);

  return {
    date: expenseDate,
    description: data.description,
    locationId,
    payment: data.payment,
    title: data.title,
    type: data.type,
    value: data.value,
  };
};

export const sanitizeLocation = (data: Location): Partial<Location> => {
  return {
    cityLat: data.cityLat,
    cityLong: data.cityLong,
    cityName: data.cityName,
    countryCode: data.countryCode,
    countryName: data.countryName,
    label: data.label,
    region: data.region,
  };
};