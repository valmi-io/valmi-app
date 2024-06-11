import { useEffect, useMemo } from 'react';

import { useLazyFetchCredentialsQuery } from '@store/api/apiSlice';

import { useRouter } from 'next/router';
import { TCredential } from '@/utils/typings.d';

export const useCredentials = ({ workspaceId, integrationType }: { workspaceId: string; integrationType: string }) => {
  const router = useRouter();

  const [getCredentials, { data, isError, error, isFetching }] = useLazyFetchCredentialsQuery();

  useEffect(() => {
    if (router.isReady && workspaceId) {
      getCredentials({ workspaceId });
    }
  }, [workspaceId, getCredentials, router]);

  const filteredCredentials = useMemo(() => {
    if (data) {
      const filteredData = data.ids.reduce((acc: TCredential[], id: string) => {
        const entitiy: TCredential = data.entities[id];
        if (entitiy.display_name.toLowerCase() === integrationType) {
          acc.push(entitiy);
        }
        return acc;
      }, []);

      return filteredData;
    }
    return null;
  }, [data, integrationType]);

  return { filteredCredentials, isError, isFetching, error };
};
