export interface TokenData {
  id: number;
  username: string;
  active: boolean;
}

export type AuthRequest = {
  user: TokenData;
};
