import { Expense } from '@prisma/client';

import prisma from '../config/db';
import { parseDate } from '../util/dateUtil';
import ApiError, { AuthError } from '../util/Error';
import { ERROR_MESSAGES } from '../util/errorUtil';
import { sanitizeUpdateExpense } from '../util/sanitizeUtil';
import { isValidExpense } from '../util/validatorUtil';

export const create = async (userId: number, expense: Omit<Expense, 'id'>) => {
  if (!isValidExpense('CREATE', expense)) {
    //Missing data
    throw new ApiError(ERROR_MESSAGES.MISSING_FIELDS, 400);
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
    },
  });

  return newExpense;
};

export const update = async (userId: number, expenseId: number, data: Expense) => {
  const storedExpense = await prisma.expense.findUnique({
    where: {
      id: expenseId,
    },
  });

  if (!storedExpense) {
    throw new AuthError(ERROR_MESSAGES.NOT_FOUND('expense'), 400);
  }

  if (storedExpense?.userId !== userId) {
    throw new ApiError(ERROR_MESSAGES.FORBIDDEN, 403);
  }

  if (!isValidExpense('UPDATE', data)) {
    //Missing data
    throw new ApiError(ERROR_MESSAGES.MISSING_FIELDS, 400);
  }

  const expense = await prisma.expense.update({
    where: {
      id: expenseId,
    },
    data: sanitizeUpdateExpense(data),
  });

  return expense;
};

export const remove = async (userId: number, expenseId: number) => {
  const storedExpense = await prisma.expense.findUnique({
    where: {
      id: expenseId,
    },
  });

  if (!storedExpense) {
    throw new ApiError(ERROR_MESSAGES.NOT_FOUND('expense'), 400);
  }

  if (storedExpense?.userId !== userId) {
    throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403);
  }

  const removedItem = await prisma.expense.delete({
    where: {
      id: expenseId,
    },
  });

  return removedItem;
};
