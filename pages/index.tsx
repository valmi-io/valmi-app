/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 2nd 2023, 2:29:57 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import Head from '@components/PageHead';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const HomePage = () => {
  const router = useRouter();

  const { isLoggedIn } = useLoginStatus();

  const { workspaceId = '' } = useWorkspaceId();

  useEffect(() => {
    if (isLoggedIn && workspaceId) {
      //@ts-ignore
      router.push(`/spaces/${workspaceId}/connections`);
    }
  }, [isLoggedIn, workspaceId]);

  return (
    <>
      <Head />
    </>
  );
};

export default HomePage;
