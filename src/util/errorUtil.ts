export const ERROR_MESSAGES = {
  EMAIL_IN_USE: 'This email is already being used.',
  EXPIRED_TOKEN: 'This token has already expired. Please login again.',
  FORBIDDEN: 'The user does not have access rights to the content.',
  INVALID_DATE: 'Invalid date format',
  INVALID_PWD: 'Email or Password invalid.',
  JSON_ERROR: 'Invalid request format',
  ENTITY_NOT_FOUND: (entity: string) => `Unable to find the ${entity} with the provided data`,
  MISSING_FIELDS: (fields: string[]) => `Those required fields are missing: ${fields.join()}`,
  NO_TOKEN: 'Invalid session, please be sure that you are logged in.',
  PREFIX_REQUIRED: (entity: string, size: number = 3) => `The ${entity} name must contain ${size} or more letters`,
  TOKEN_ERROR: 'Invalid Token.',
  UNEXPECTED_ERROR: 'Unexpected Error.',
  USERNAME_IN_USE: 'This username is already being used.',
  ACTIVATED_ACCOUNT: 'This account is already activated',
};

export const getPrismaErrorMessage = (code: string) => {
  switch (code) {
    case 'P2002':
      return 'Duplicated entry';
    case 'P2003':
      return ERROR_MESSAGES.ENTITY_NOT_FOUND('Entity');
    case 'P2006':
      return 'Invalid value provided';
    default:
      return ERROR_MESSAGES.UNEXPECTED_ERROR;
  }
};
