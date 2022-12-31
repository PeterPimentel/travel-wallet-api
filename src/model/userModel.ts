import prisma from '../config/db';
import { UserFindQuery } from "../types/QueryType";

export const findOne = async (userQuery: Partial<UserFindQuery>, withCredential: boolean = false) => {
    const user = await prisma.user.findFirst({
        where: {
            ...userQuery,
        },
        select: {
            email: true,
            username: true,
            id: true,
            password: withCredential,
            activationToken: true,
            active: true,
            role: true,
        },
    });

    return user;
};

export const findByIdsLean = async (userIds: number[]) => {
    const user = await prisma.user.findMany({
        where: {
            id: { in: userIds },
        },
        select: {
            email: true,
            id: true,
        },
    });

    return user;
};