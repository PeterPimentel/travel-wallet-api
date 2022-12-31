import { Expense } from '@prisma/client';

import prisma from '../config/db';

import { parseDate } from '../util/dateUtil';
import { sanitizeUpdateExpense } from '../util/sanitizeUtil';

export const create = async (userId: number, expense: Omit<Expense, 'id'>, locationId: number | null = null) => {
    const expenseDate = parseDate(expense.date as unknown as string);

    const newExpense = await prisma.expense.create({
        data: {
            date: expenseDate,
            description: expense.description,
            locationId: locationId,
            payment: expense.payment,
            title: expense.title,
            travelId: expense.travelId,
            type: expense.type,
            userId,
            value: expense.value,
        },
        include: {
            location: true
        }
    });

    return newExpense;
};

export const findOne = async (expenseId: number) => {
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

export const update = async (expenseId: number, data: Expense, locationId: number | null = null) => {
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

export const remove = async (expenseId: number) => {
    const removedItem = await prisma.expense.delete({
        where: {
            id: expenseId,
        },
    });

    return removedItem;
};

export const bulkRemove = async (travelId: number) => {
    return prisma.expense.deleteMany({
        where: {
            travelId,
        },
    });
};