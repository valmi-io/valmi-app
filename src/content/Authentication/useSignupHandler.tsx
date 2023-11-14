//@ts-nocheck
import { useState } from 'react';

import { useLazySignupUserQuery } from '@store/api/apiSlice';

const useSignupHandler = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // signup query
  const [signupUser, { isFetching }] = useLazySignupUserQuery();

  const handleSignup = async (payload: any) => {
    setError(null);

    try {
      const response = await signupUser(payload).unwrap();
      setData(response);
    } catch (error) {
      setError(error);
    }
  };

  return { data, isFetching, error, handleSignup };
};

export default useSignupHandler;
