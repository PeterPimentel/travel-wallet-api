import { format, isValid, parse, add, isAfter } from 'date-fns';
import ApiError from './Error';
import { ERROR_MESSAGES } from './errorUtil';

export const DATE_FORMAT = 'dd-MM-yyyy';

export const formatDate = (date: Date, pattern: string = DATE_FORMAT): string => {
  return format(date, pattern);
};

export const parseDate = (value: string, pattern: string = DATE_FORMAT): Date => {
  const date = parse(value, pattern, new Date());
  if (!isValidDate(date)) {
    throw new ApiError(ERROR_MESSAGES.INVALID_DATE, 400);
  }

  return date;
};

export const isValidDate = (date: any): boolean => {
  return isValid(date);
};

type Duration = {
  minutes?: number;
  hours?: number;
  days?: number;
}

export const addToDate = (date: Date, duration: Duration): Date => {
  return add(date, duration)
}
export const isDateAfter = (date: Date, dateToCompare: Date): boolean => {
  return isAfter(date, dateToCompare)
}
