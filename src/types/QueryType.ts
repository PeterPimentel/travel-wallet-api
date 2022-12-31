export interface UserFindQuery {
  id: number;
  email: string;
  username: string;
  activationToken: string;
}

export interface SharedTravelFindQuery {
  travelId: number;
  userId: number;
}