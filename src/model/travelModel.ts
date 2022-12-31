import { Travel } from '@prisma/client';

import prisma from '../config/db';

import { sanitizeTravel } from '../util/sanitizeUtil';

export const create = async (ownerId: number, travel: Omit<Travel, 'id'>) => {
    const newTravel = await prisma.travel.create({
        data: {
            name: travel.name,
            cover: travel.cover,
            ownerId,
            budget: travel.budget ? travel.budget : null,
        },
    });

    return newTravel;
};

export const find = async (userId: number) => {
    const travels = await prisma.travel.findMany({
        where: {
            ownerId: userId,
        },
        include: {
            expenses: {
                orderBy: {
                    date: 'desc',
                },
                include: {
                    location: true
                }
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return travels;
};

export const findOne = async (ownerId: number, travelId: number) => {
    const travels = await prisma.travel.findFirst({
        where: {
            id: travelId,
            ownerId,
        },
        include: {
            expenses: {
                orderBy: {
                    date: 'desc',
                },
                include: {
                    location: true
                }
            },
        },
    });

    return travels;
};

export const findById = async (travelId: number) => {
    const travels = await prisma.travel.findUnique({
        where: {
            id: travelId,
        },
        include: {
            expenses: {
                orderBy: {
                    date: 'desc',
                },
                include: {
                    location: true
                }
            },
        },
    });

    return travels;
};

export const findByIdLean = async (travelId: number) => {
    const travels = await prisma.travel.findUnique({
        where: {
            id: travelId,
        },
    });

    return travels;
};

export const findByIdsLean = async (travelIds: number[]) => {
    const travels = await prisma.travel.findMany({
        where: {
            id: { in: travelIds },
        },
    });

    return travels;
};

export const update = async (travelId: number, data: Travel) => {
    const travel = await prisma.travel.update({
        where: {
            id: travelId,
        },
        data: sanitizeTravel('UPDATE', data),
    });

    return travel;
};

export const remove = async (travelId: number) => {
    const removedItem = await prisma.travel.delete({
        where: {
            id: travelId,
        },
    });

    return removedItem;
};