export interface TokenData {
  id: number;
  username: string;
}

export type AuthRequest = {
  user: TokenData;
};
