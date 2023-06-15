/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 2nd 2023, 2:29:57 pm
 * Author: Nagendra S @ valmi.io
 */

import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Head from '@/components/PageHead';
import { RootState } from '@/store/reducers';

const propTypes = {};

const defaultProps = {};

const HomePage = () => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  useEffect(() => {
    if (workspaceId !== '') {
      router.push(`/spaces/${workspaceId}/syncs`);
    }
  }, []);

  return (
    <>
      <Head />
    </>
  );
};

HomePage.propTypes = propTypes;

HomePage.defaultProps = defaultProps;

export default HomePage;
