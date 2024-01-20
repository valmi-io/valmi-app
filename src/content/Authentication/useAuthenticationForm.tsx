/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, October 18th 2023, 6:22:09 pm
 * Author: Nagendra S @ valmi.io
 */

import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

export const useAuthenticationForm = (validationSchema: any) => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {},
    resolver: yupResolver(validationSchema)
  });

  return { control, handleSubmit, watch };
};
