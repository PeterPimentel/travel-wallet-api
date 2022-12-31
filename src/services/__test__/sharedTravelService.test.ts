import { ERROR_CODES, ERROR_MESSAGES } from '../../util/errorUtil';

import * as travelModel from '../../model/travelModel';
import * as userModel from '../../model/userModel';
import * as sharedTravelModel from '../../model/sharedTravelModel';
import * as mailService from '../mailService';

import * as sharedTravelService from '../sharedTravelService';

const MOCK_USER_OWNER = {
    id: 1,
    email: 'owner@email.com'
}

const MOCK_USER_INVITED = {
    id: 3,
    email: 'fake@email.com'
}

const MOCK_TRAVEL = {
    name: 'Mocked Travel',
    ownerId: MOCK_USER_OWNER.id,
    id: 2
}

const MOCK_SHARED_TRAVEL = {
    travelId: MOCK_TRAVEL.id,
    invitedUserEmail: MOCK_USER_INVITED.email
}

const MOCK_SHARED_REFERENCE = {
    id: 10,
    travelId: MOCK_TRAVEL.id,
    userId: MOCK_USER_INVITED.id
}

jest.mock('../../model/travelModel', () => ({
    findById: jest.fn(() => Promise.resolve(MOCK_TRAVEL)),
    findByIdLean: jest.fn(() => Promise.resolve(MOCK_TRAVEL))
}))
jest.mock('../../model/userModel', () => ({
    findOne: jest.fn(() => Promise.resolve(MOCK_USER_INVITED))
}))
jest.mock('../../model/sharedTravelModel', () => ({
    findFirstLean: jest.fn(() => Promise.resolve(null)),
    findByIdLean: jest.fn(() => Promise.resolve(MOCK_SHARED_REFERENCE)),
    create: jest.fn(() => Promise.resolve(true)),
    remove: jest.fn(() => Promise.resolve(true)),
}))
jest.mock('../mailService', () => ({
    sendSharedTravelNotificationEmail: jest.fn(),
}))

beforeEach(jest.clearAllMocks)
describe('create', () => {

    describe('Error', () => {
        describe('when the shared travel does not have a travel Id associated', () => {
            test('should throw a missing fields error', async () => {
                try {
                    await sharedTravelService.create(MOCK_TRAVEL.ownerId, { invitedUserEmail: MOCK_USER_INVITED.email } as any)
                } catch (error: any) {
                    expect(error.message).toBe(ERROR_MESSAGES.MISSING_FIELDS(['travelId']))
                    expect(error.statusCode).toBe(400)
                    expect(error.code).toBe(ERROR_CODES.travel_not_found)
                }
            })
        })

        describe('when the shared travel does not have a invitedUserEmail', () => {
            test('should throw a missing fields error', async () => {
                try {
                    await sharedTravelService.create(MOCK_TRAVEL.ownerId, { travelId: MOCK_TRAVEL.id } as any)
                } catch (error: any) {
                    expect(error.message).toBe(ERROR_MESSAGES.MISSING_FIELDS(['invitedUserEmail']))
                    expect(error.statusCode).toBe(400)
                    expect(error.code).toBe(ERROR_CODES.travel_not_found)
                }
            })
        })

        describe('when the shared travel is not found', () => {
            test('should throw a not found error', async () => {
                try {
                    (travelModel.findById as jest.Mock).mockReturnValueOnce(Promise.resolve(null))
                    await sharedTravelService.create(MOCK_TRAVEL.ownerId, MOCK_SHARED_TRAVEL)
                } catch (error: any) {
                    expect(error.message).toBe(ERROR_MESSAGES.ENTITY_NOT_FOUND('travel'))
                    expect(error.statusCode).toBe(400)
                    expect(error.code).toBe(ERROR_CODES.travel_not_found)
                }
            })
        })

        describe('when the travel owner is not the same as the user requesting', () => {
            test('should throw a forbidden error', async () => {
                try {
                    await sharedTravelService.create(5, MOCK_SHARED_TRAVEL)
                } catch (error: any) {
                    expect(error.message).toBe(ERROR_MESSAGES.FORBIDDEN)
                    expect(error.statusCode).toBe(403)
                    expect(error.code).toBe(ERROR_CODES.forbidden)
                }
            })
        })

        describe('when the invited user is not registered', () => {
            test('should throw a not found error', async () => {
                try {
                    (userModel.findOne as jest.Mock).mockReturnValueOnce(Promise.resolve(null))
                    await sharedTravelService.create(MOCK_TRAVEL.ownerId, MOCK_SHARED_TRAVEL)
                } catch (error: any) {
                    expect(error.message).toBe(ERROR_MESSAGES.ACCOUNT_NOT_FOUND)
                    expect(error.statusCode).toBe(400)
                    expect(error.code).toBe(ERROR_CODES.account_not_found)
                }
            })
        })

        describe('when the invited user is the travel owner', () => {
            test('should throw a forbidden error', async () => {
                try {
                    (userModel.findOne as jest.Mock).mockReturnValueOnce(Promise.resolve({ id: MOCK_TRAVEL.ownerId }))
                    await sharedTravelService.create(MOCK_TRAVEL.ownerId, MOCK_SHARED_TRAVEL)
                } catch (error: any) {
                    expect(error.message).toBe(ERROR_MESSAGES.FORBIDDEN)
                    expect(error.statusCode).toBe(400)
                    expect(error.code).toBe(ERROR_CODES.forbidden)
                }
            })
        })
        describe('when the travel is already shared', () => {
            test('should throw a error', async () => {
                try {
                    (sharedTravelModel.findFirstLean as jest.Mock).mockReturnValueOnce(Promise.resolve({ id: 20 }))
                    await sharedTravelService.create(MOCK_TRAVEL.ownerId, MOCK_SHARED_TRAVEL)
                } catch (error: any) {
                    expect(error.message).toBe(ERROR_MESSAGES.TRAVEL_ALREADY_SHARED)
                    expect(error.statusCode).toBe(400)
                    expect(error.code).toBe(ERROR_CODES.travel_already_shared)
                }
            })
        })
    })
    describe('Success', () => {
        test('should call the function to get the necessary data', async () => {
            await sharedTravelService.create(MOCK_TRAVEL.ownerId, MOCK_SHARED_TRAVEL)

            expect(travelModel.findById).toHaveBeenCalledWith(MOCK_SHARED_TRAVEL.travelId)
            expect(userModel.findOne).toHaveBeenNthCalledWith(1, { email: MOCK_SHARED_TRAVEL.invitedUserEmail })
            expect(userModel.findOne).toHaveBeenNthCalledWith(2, { id: MOCK_TRAVEL.ownerId })
            expect(sharedTravelModel.findFirstLean).toHaveBeenCalledWith({
                travelId: MOCK_SHARED_TRAVEL.travelId,
                userId: MOCK_USER_INVITED.id
            })
        })
        test('should call sharedTravelModel create with the correct params', async () => {
            await sharedTravelService.create(MOCK_TRAVEL.ownerId, MOCK_SHARED_TRAVEL)

            expect(sharedTravelModel.create).toHaveBeenCalledWith(MOCK_TRAVEL.id, MOCK_USER_INVITED.id, MOCK_TRAVEL.ownerId)
        })

        test('should call sendSharedTravelNotificationEmail with the correct params', async () => {
            (userModel.findOne as jest.Mock)
                .mockReturnValueOnce(Promise.resolve(MOCK_USER_INVITED))
                .mockReturnValueOnce(Promise.resolve({ id: MOCK_TRAVEL.ownerId, email: MOCK_USER_OWNER.email }))

            await sharedTravelService.create(MOCK_TRAVEL.ownerId, MOCK_SHARED_TRAVEL)

            expect(mailService.sendSharedTravelNotificationEmail).toHaveBeenLastCalledWith(
                MOCK_SHARED_TRAVEL.invitedUserEmail, MOCK_USER_OWNER.email, MOCK_TRAVEL.name, MOCK_TRAVEL.id)
        })
    })
})

describe('remove', () => {
    describe('Error', () => {
        describe('When there are not a shared travel', () => {
            test('should throw a not found error', async () => {
                try {
                    (sharedTravelModel.findByIdLean as jest.Mock).mockReturnValueOnce(Promise.resolve(null))
                    await sharedTravelService.remove(MOCK_USER_INVITED.id, MOCK_SHARED_REFERENCE.id)
                } catch (error: any) {
                    expect(error.message).toBe(ERROR_MESSAGES.ENTITY_NOT_FOUND('share reference'))
                    expect(error.statusCode).toBe(400)
                }
            })
        })

        describe('When the travel is not found', () => {
            test('should throw a not found error', async () => {
                try {
                    (travelModel.findByIdLean as jest.Mock).mockReturnValueOnce(Promise.resolve(null))
                    await sharedTravelService.remove(MOCK_TRAVEL.ownerId, MOCK_SHARED_REFERENCE.id)
                } catch (error: any) {
                    expect(error.message).toBe(ERROR_MESSAGES.ENTITY_NOT_FOUND('travel'))
                    expect(error.statusCode).toBe(400)
                    expect(error.code).toBe(ERROR_CODES.travel_not_found)
                }
            })
        })
        describe('When the request user is neither the owner or the user that was invited', () => {
            test('should throw a not found error', async () => {
                try {
                    await sharedTravelService.remove(45, MOCK_SHARED_REFERENCE.id)
                } catch (error: any) {
                    expect(error.message).toBe(ERROR_MESSAGES.FORBIDDEN)
                    expect(error.statusCode).toBe(403)
                    expect(error.code).toBe(ERROR_CODES.forbidden)
                }
            })
        })
    })

    describe('Success', () => {
        describe('When is the user itself requesting the delete', () => {
            test('should call sharedTravelModel.remove with correct params', async () => {
                await sharedTravelService.remove(MOCK_USER_INVITED.id, MOCK_SHARED_REFERENCE.id)

                expect(travelModel.findByIdLean).not.toHaveBeenCalled()
                expect(sharedTravelModel.remove).toHaveBeenCalledWith(MOCK_SHARED_REFERENCE.id)
            })
        })

        describe('When is the user it is the owner of the travel', () => {
            test('should call sharedTravelModel.remove with correct params', async () => {
                await sharedTravelService.remove(MOCK_TRAVEL.ownerId, MOCK_SHARED_REFERENCE.id)

                expect(travelModel.findByIdLean).toHaveBeenCalledWith(MOCK_TRAVEL.id)
                expect(sharedTravelModel.remove).toHaveBeenCalledWith(MOCK_SHARED_REFERENCE.id)
            })
        })
    })
})