/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 5:16:02 pm
 * Author: Nagendra S @ valmi.io
 */

import * as yup from 'yup';

export const signupValidationSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().required().email('Invalid email address'),
  password: yup.string().required()
  // .min(8, 'Password must be at least 8 characters')
});

export const signinValidationSchema = yup.object({
  email: yup.string().required().email('Invalid email address'),
  password: yup.string().required()
  // .min(8, 'Password must be at least 8 characters')
});

export const resetPasswordValidationSchema = yup.object({
  email: yup.string().required().email('Invalid email address')
});

export const confirmPasswordResetValidationSchema = yup.object({
  password: yup.string().required()
});
