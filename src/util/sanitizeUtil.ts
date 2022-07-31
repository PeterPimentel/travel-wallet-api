import { Travel, Expense } from '@prisma/client';

export const sanitizeTravel = (operation: 'CREATE' | 'UPDATE', data: Travel): Partial<Travel> => {
  if (operation === 'CREATE') {
    return data;
  } else {
    return {
      name: data.name,
      cover: data.cover,
      budget: data.budget ? data.budget : null,
    };
  }
};

export const sanitizeUpdateExpense = (data: Expense): Partial<Expense> => {
  return {
    date: data.date,
    description: data.description,
    payment: data.payment,
    title: data.title,
    type: data.title,
    value: data.value,
  };
};
