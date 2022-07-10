import { Expense, Travel } from '@prisma/client';

export const isValidTravel = (data: Partial<Travel>): boolean => {
  if (data.name && data.cover) {
    return true;
  } else {
    return false;
  }
};

export const isValidExpense = (operation: 'CREATE' | 'UPDATE', data: Partial<Expense>): boolean => {
  if (operation === 'CREATE') {
    if (data.title && data.date && data.payment && data.type && data.travelId) {
      return true;
    } else {
      return false;
    }
  } else {
    if (data.title && data.date && data.payment && data.type) {
      return true;
    } else {
      return false;
    }
  }
};
