/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 2nd 2023, 2:29:57 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import Head from '@components/PageHead';
import { RootState } from '@store/reducers';
import { useSearchParams } from 'next/navigation';
import { getSearchParams } from '@/utils/router-utils';
import { initialiseAppState } from '@/utils/login-utils';

const propTypes = {};

const defaultProps = {};

const HomePageLayout = () => {
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  return <HomePage params={params} />;
};

const HomePage = ({ params }: { params: any }) => {
  const router = useRouter();

  const dispatch = useDispatch();

  const { wid = '' } = params ?? {};

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  useEffect(() => {
    if (workspaceId) {
      router.push(`/spaces/${workspaceId}/connections`);
    } else if (wid) {
      initialiseAppState(dispatch, wid);
      router.push(`/spaces/${wid}/connections`);
    }
  }, [wid, workspaceId]);

  return (
    <>
      <Head />
    </>
  );
};

HomePageLayout.propTypes = propTypes;

HomePageLayout.defaultProps = defaultProps;

export default HomePageLayout;
