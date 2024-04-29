/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 2nd 2023, 2:29:57 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import Head from '@components/PageHead';
import { RootState } from '@store/reducers';
import { useSearchParams } from 'next/navigation';
import { getSearchParams } from '@/utils/router-utils';
import { initialiseAppState } from '@/utils/login-utils';
import { signOut, useSession } from 'next-auth/react';
import { signOutUser } from '@/utils/lib';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const HomePage = () => {
  const { data: session } = useSession();

  const { workspaceId = null } = useWorkspaceId();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      console.log('home page session', session);
      console.log('Home page:_', workspaceId);
      router.push(`/spaces/${workspaceId}/connections`);
    }
  }, [session]);

  return (
    <>
      {/* {session && (
        <button
          onClick={() => {
            signOut();
            signOutUser(router);
          }}
        >
          signout
        </button>
      )} */}
      <Head />
    </>
  );
};

export default HomePage;
