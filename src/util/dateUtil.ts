import { format, isValid, parse } from 'date-fns';
import ApiError from './Error';
import { ERROR_MESSAGES } from './errorUtil';

export const DATE_FORMAT = 'dd-MM-yyyy';

export const formatDate = (date: Date, pattern: string = DATE_FORMAT): string => {
  return format(date, pattern);
};

export const parseDate = (value: string, pattern: string = DATE_FORMAT): Date => {
  try {
    return parse(value, pattern, new Date());
  } catch (error) {
    throw new ApiError(ERROR_MESSAGES.INVALID_DATE, 400);
  }
};

export const isValidDate = (date: any): boolean => {
  return isValid(date);
};
