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
  ACCOUNT_NOT_ACTIVATED: 'This account is not activated',
  PASSWORD_RESET_LIMIT_EXCEEDED: 'Too many password reset requests! You will be able to try again in 24h',
  PASSWORD_RESET_NO_REQUEST: 'There is no password reset request for this user',
  PASSWORD_RESET_EXPIRED_CODE: 'This code has already expired',
  PASSWORD_RESET_INVALID_CODE: 'Invalid code provided',
};

// This codes should be used when the message must be translated
export const ERROR_CODES = {
  account_activated: 'tw_account_activated', // Acount is already activated
  account_not_activated: 'tw_account_not_activated', // Acount was not activated
  activation_success: 'tw_activation_success', // Acount was activated with success
  email_in_use: 'tw_email_in_use', // email is already being used
  forbidden: 'tw_forbidden', // user does not have access rights to the content
  invalid_pwd: 'tw_invalid_pwd', // Email or Password invalid
  password_reset_expired_code: 'tw_password_reset_expired_code', // Expired reset code
  password_reset_invalid_code: 'tw_password_reset_invalid_code', // Expired reset code
  password_reset_limit_exceeded: 'tw_password_reset_limit_exceeded', // Retries limit exceeded
  password_reset_no_request: 'tw_password_reset_no_request', // no password reset request for user
  token_not_found: 'tw_token_not_found', //User already activated or account deleted
  unexpected_error: 'tw_unexpected_error', // Unexpected Error
  user_not_found: 'tw_user_not_found', // User not found
  username_in_use: 'tw_username_in_use', // username is already being used
}

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
