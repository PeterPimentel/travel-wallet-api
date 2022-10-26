import { Travel } from "@prisma/client";
import { checkProperties, ValidatorResponse } from "./common";

export const isValidTravel = (data: Partial<Travel>): ValidatorResponse => {
  const PROPS = ['name', 'cover']

  return checkProperties(data, PROPS)
};
