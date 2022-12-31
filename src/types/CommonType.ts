export type Status = "success" | "error";

export type AdminRole = 'ADMIN'
export type UserRole = 'USER'

export type RoleAccessType = AdminRole | UserRole;

export type KeyValue<T> = {
    [key: string]: T
}