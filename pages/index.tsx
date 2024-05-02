/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 2nd 2023, 2:29:57 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import Head from '@components/PageHead';
import { useSession } from 'next-auth/react';

const HomePage = () => {
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session) {
      // @ts-ignore
      router.push(`/spaces/${session?.workspaceId ?? ''}/connections`);
    } else {
      router.push('/login');
    }
  }, [session]);

  return (
    <>
      <Head />
    </>
  );
};

export default HomePage;
