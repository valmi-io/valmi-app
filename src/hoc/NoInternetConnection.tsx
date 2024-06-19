import { useNavigatorOnLine } from '@/hooks/useNavigatorOnline';
import React from 'react';

const NoInternetConnection = (props: any) => {
  // state variable holds the state of the internet connection

  const isOnline = useNavigatorOnLine();

  // if user is online, return the child component else return a custom component
  if (isOnline) {
    return props.children;
  } else {
    return <h1>No Internet Connection. Please try again later.</h1>;
  }
};

export default NoInternetConnection;
