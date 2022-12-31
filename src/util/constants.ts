import { AdminRole, UserRole } from "../types/CommonType"

export const EMAIL_TEMPLATE = {
    account_verification: 'd-7bab4354efab403e83142e7154085ed1',
    password_reset: 'd-f38cd2bf7e004cfcadbd2f7cebea9b1b',
    travel_shared: 'd-df98929ae3f045da90a42570b7376809',
}

type RoleMap = {
    admin: AdminRole,
    user: UserRole
}

export const ROLE: RoleMap = {
    admin: 'ADMIN',
    user: 'USER'
}