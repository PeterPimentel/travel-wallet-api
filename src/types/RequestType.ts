export interface TokenData {
  id: number;
  username: string;
}

export type AuthRequest = {
  user: TokenData;
};
// export type AuthRequest = {
//   user: TokenData;
// } & Request;
