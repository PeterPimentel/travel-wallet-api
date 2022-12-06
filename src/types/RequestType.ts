import { RoleAccessType } from "./CommonType";

export interface TokenData {
  id: number;
  username: string;
  active: boolean;
  role: RoleAccessType;
}

export type AuthRequest = {
  user: TokenData;
};
