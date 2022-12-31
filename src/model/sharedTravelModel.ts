import prisma from '../config/db';
import { SharedTravelFindQuery } from '../types/QueryType';

export const create = async (travelId: number, userId: number, travelOwnerId: number) => {
    await prisma.sharedTravel.create({
        data: {
            travelId: travelId,
            userId: userId,
            travelOwnerId: travelOwnerId
        },
    });

    return null;
};


export const findMany = async (query: Partial<SharedTravelFindQuery>) => {
    const shareds = await prisma.sharedTravel.findMany({
        where: {
            ...query
        },
        include: {
            travel: {
                include: {
                    expenses: {
                        orderBy: {
                            date: 'desc',
                        },
                        include: {
                            location: true
                        }
                    }
                },
            },
        }
    });

    const sharedTravels = shareds.map(share => share.travel)

    return sharedTravels;
};

export const findManyLean = async (query: Partial<SharedTravelFindQuery>) => {
    const shareds = await prisma.sharedTravel.findMany({
        where: {
            ...query
        }
    });
    return shareds;
};

export const findFirstLean = async (query: SharedTravelFindQuery) => {
    const sharedTravel = await prisma.sharedTravel.findFirst({
        where: {
            ...query
        }
    });

    return sharedTravel;
};

export const findByIdLean = async (id: number) => {
    const sharedTravel = await prisma.sharedTravel.findUnique({
        where: {
            id
        }
    });

    return sharedTravel;
};

export const remove = async (sharedId: number) => {
    const removedItem = await prisma.sharedTravel.delete({
        where: {
            id: sharedId,
        },
    });

    return removedItem;
};

export const bulkRemove = async (travelId: number) => {
    return prisma.sharedTravel.deleteMany({
        where: {
            travelId,
        },
    });
};