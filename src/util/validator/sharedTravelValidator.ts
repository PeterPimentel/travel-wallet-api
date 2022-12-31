import { checkProperties, ValidatorResponse } from "./common";

export const isValidSharidTravel = (data: {
    travelId: number,
    invitedUserEmail: string,
}): ValidatorResponse => {
    const PROPS = ['travelId', 'invitedUserEmail']

    return checkProperties(data, PROPS)
};
