import ApiError, { AuthError } from '../util/Error';
import { ERROR_CODES, ERROR_MESSAGES } from '../util/errorUtil';

import * as travelModel from '../model/travelModel';
import * as userModel from '../model/userModel';
import * as sharedTravelModel from '../model/sharedTravelModel';
import { KeyValue } from '../types/CommonType';
import { sendSharedTravelNotificationEmail } from './mailService';
import { isValidSharidTravel } from '../util/validator/sharedTravelValidator';

type SharedTravelRequest = {
    travelId: number,
    invitedUserEmail: string,
}
export const create = async (ownerId: number, sharedTravel: SharedTravelRequest) => {
    const validator = isValidSharidTravel(sharedTravel)
    if (!validator.valid) {
        throw new ApiError(ERROR_MESSAGES.MISSING_FIELDS(validator.fields), 400, ERROR_CODES.travel_not_found);
    }

    const storedTravel = await travelModel.findById(sharedTravel.travelId);

    if (!storedTravel) {
        throw new ApiError(ERROR_MESSAGES.ENTITY_NOT_FOUND('travel'), 400, ERROR_CODES.travel_not_found);
    }

    if (storedTravel?.ownerId !== ownerId) {
        throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403, ERROR_CODES.forbidden);
    }

    const invitedUser = await userModel.findOne({ email: sharedTravel.invitedUserEmail })
    if (!invitedUser) {
        throw new ApiError(ERROR_MESSAGES.ACCOUNT_NOT_FOUND, 400, ERROR_CODES.account_not_found);
    }

    if (storedTravel?.ownerId === invitedUser.id) {
        throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 400, ERROR_CODES.forbidden);
    }

    const isAlreadyShared = await sharedTravelModel.findFirstLean({ travelId: storedTravel.id, userId: invitedUser.id })

    if (isAlreadyShared) {
        throw new ApiError(ERROR_MESSAGES.TRAVEL_ALREADY_SHARED, 400, ERROR_CODES.travel_already_shared);
    }

    const travelOwner = await userModel.findOne({ id: storedTravel.ownerId })

    await sharedTravelModel.create(sharedTravel.travelId, invitedUser.id, ownerId)

    sendSharedTravelNotificationEmail(sharedTravel.invitedUserEmail, travelOwner?.email || '', storedTravel.name, storedTravel.id)

    return null
}

export const find = async (userId: number) => {
    const sharedTravels = await sharedTravelModel.findMany({ userId })

    return sharedTravels;
};

export const findUsers = async (userId: number, travelId: number) => {
    const sharedTravels = await sharedTravelModel.findManyLean({ travelId })
    const travelIds = sharedTravels.map(s => s.travelId)
    const userIds = sharedTravels.map(s => s.userId)

    const travels = await travelModel.findByIdsLean(travelIds)

    if (travels.some(travel => travel.ownerId !== userId)) {
        throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403, ERROR_CODES.forbidden);
    }

    const users = await userModel.findByIdsLean(userIds)

    const userShareRelation = sharedTravels.reduce<KeyValue<number>>((acc, curr) => {
        acc[curr.userId] = curr.id
        return acc
    }, {})

    const usersShare = users.map(user => ({
        id: user.id,
        email: user.email,
        shareId: userShareRelation[user.id]
    }))

    return usersShare;
};

// The owner of the travel or the user by itself are able to remove the reference
// so the userId can be one of them
export const remove = async (userId: number, sharedId: number) => {
    const sharedReference = await sharedTravelModel.findByIdLean(sharedId)

    if (!sharedReference) {
        throw new ApiError(ERROR_MESSAGES.ENTITY_NOT_FOUND('share reference'), 400);
    }

    // User itself
    if (sharedReference.userId === userId) {
        const removedItem = await sharedTravelModel.remove(sharedId)
        return removedItem
    }

    const storedTravel = await travelModel.findByIdLean(sharedReference.travelId)

    if (!storedTravel) {
        throw new ApiError(ERROR_MESSAGES.ENTITY_NOT_FOUND('travel'), 400, ERROR_CODES.travel_not_found);
    }

    if (storedTravel?.ownerId !== userId) {
        throw new AuthError(ERROR_MESSAGES.FORBIDDEN, 403, ERROR_CODES.forbidden);
    }

    // Owner of the travel
    const removedItemByOwner = await sharedTravelModel.remove(sharedId)
    return removedItemByOwner

}