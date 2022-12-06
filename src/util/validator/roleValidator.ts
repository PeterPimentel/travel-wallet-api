import { RoleAccessType } from "../../types/CommonType";
import { ROLE } from "../constants";

export const hasRoleAccess = (role: RoleAccessType, userRole: RoleAccessType) => {
    if (role === ROLE.admin) {
        return userRole === role
    }

    if (role === ROLE.user) {
        return userRole === ROLE.admin || userRole === ROLE.user
    }

    return false
}