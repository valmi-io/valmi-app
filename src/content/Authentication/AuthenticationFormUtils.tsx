// @ts-nocheck

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

{
  /** Signup success handler */
}
export const handleSignupSuccess = (dispatch, data: any) => {
  const router = useRouter();
  const { is_active = false, email = '' } = data || {};
  let isLoggedIn = false;
  let emailSentDialog = false;
  if (is_active) {
    isLoggedIn = true;
  } else {
    emailSentDialog = true;
  }

  updateLoginFlowState({
    dispatch,
    isloggedIn,
    email,
    emailSentDialog,
    resendActivationLink: false
  });

  console.log('navigating to activate screen');

  router.push('/activate');
};

{
  /** Update login flow state */
}

export const updateLoginFlowState = ({
  dispatch,
  isloggedIn,
  email,
  emailSentDialog,
  resendActivationLink
}) => {
  dispatch(
    setAppState({
      ...appState,
      loginFlowState: {
        isLoggedIn: isloggedIn,
        userEmail: email,
        emailSentDialog: emailSentDialog,
        resendActivationLink: resendActivationLink
      }
    })
  );
};
