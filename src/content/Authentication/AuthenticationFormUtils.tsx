/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, October 18th 2023, 7:13:03 pm
 * Author: Nagendra S @ valmi.io
 */

import { getEmailField, getPasswordField, getUsernameField } from '@utils/form-utils';

{
  /** Generate sign up form fields */
}
export const generateSignupFormFields = () => {
  return [getUsernameField(), getEmailField(), getPasswordField()];
};

{
  /** Generate login form fields */
}
export const generateLoginFormFields = () => {
  return [getEmailField(), getPasswordField()];
};

{
  /** Generate signup / login form payload */
}
export const generateAuthenticationPayload = (values: any) => {
  let payload: any = {};
  for (const key in values) {
    payload[key] = values[key];
  }
  return payload;
};

export const generateResetPasswordFields = () => {
  return [getEmailField()];
};

export const generateConfirmPasswordResetFields = () => {
  return [getPasswordField()];
};
