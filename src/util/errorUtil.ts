export const ERROR_MESSAGES = {
  INVALID_PWD: 'Email or Password invalid.',
  UNEXPECTED_ERROR: 'Unexpected Error.',
  EXPIRED_TOKEN: 'This token has already expired. Please login again.',
  TOKEN_ERROR: 'Invalid Token.',
  NO_TOKEN: 'Invalid session, please be sure that you are logged in.',
  FORBIDDEN: 'The user does not have access rights to the content.',
  JSON_ERROR: 'Invalid request format',
  MISSING_FIELDS: 'Some required fields are missing',
  INVALID_DATE: 'Invalid date format',
  NOT_FOUND: (entity: string) => `Unable to find the ${entity} with the provided Id`,
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
