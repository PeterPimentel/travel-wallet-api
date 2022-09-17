export const ERROR_MESSAGES = {
  EMAIL_IN_USE: 'This email is already being used.',
  USERNAME_IN_USE: 'This username is already being used.',
  EXPIRED_TOKEN: 'This token has already expired. Please login again.',
  FORBIDDEN: 'The user does not have access rights to the content.',
  INVALID_DATE: 'Invalid date format',
  INVALID_PWD: 'Email or Password invalid.',
  JSON_ERROR: 'Invalid request format',
  MISSING_FIELDS: 'Some required fields are missing',
  NO_TOKEN: 'Invalid session, please be sure that you are logged in.',
  NOT_FOUND: (entity: string) => `Unable to find the ${entity} with the provided Id`,
  TOKEN_ERROR: 'Invalid Token.',
  UNEXPECTED_ERROR: 'Unexpected Error.',
};

export const getPrismaErrorMessage = (code: string) => {
  switch (code) {
    case 'P2002':
      return 'Duplicated entry';
    case 'P2003':
      return 'Entity not found';
    case 'P2006':
      return 'Invalid value provided';
    default:
      return ERROR_MESSAGES.UNEXPECTED_ERROR;
  }
};
