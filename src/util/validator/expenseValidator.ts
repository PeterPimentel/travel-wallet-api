import { Expense } from "@prisma/client";
import { checkProperties, ValidatorResponse } from "./common";

export const isValidExpense = (operation: 'CREATE' | 'UPDATE', data: Partial<Expense>): ValidatorResponse => {
  const CREATE_PROPS = ['title', 'date', 'payment', 'type', 'travelId','value']
  const UPDATE_PROPS = ['title', 'date', 'payment', 'type']

  if (operation === 'CREATE') {
    return checkProperties(data, CREATE_PROPS)
  } else {
    return checkProperties(data, UPDATE_PROPS)
  }
};