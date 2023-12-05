import { setAppState } from '@store/reducers/appFlow';

import {
  getEmailField,
  getPasswordField,
  getUsernameField
} from '@utils/form-utils';
import { useRouter } from 'next/router';

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
