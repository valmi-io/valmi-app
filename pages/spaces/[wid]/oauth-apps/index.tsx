/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 23rd 2024, 12:44:57 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useState } from 'react';

import { useRouter } from 'next/router';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { useFetch } from '@/hooks/useFetch';
import { flattenObjectValuesToArray, getBaseRoute } from '@/utils/lib';
import { Box, Grid } from '@mui/material';
import { useGetConfiguredConnectorsQuery, useGetNotConfiguredConnectorsQuery } from '@/store/api/oauthApiSlice';

import OAuthApps from '@/content/OAuthApps';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

type ConnectorType = {
  display_name: string;
  docker_image: string;
  docker_tag: string;
  oauth?: boolean;
  type: string;
};

type ConnectorData = {
  [key: string]: ConnectorType[];
};

export type OAuthConnectorsState = {
  type: string; // selected connector type
  configured: boolean; // is selected connector configured
};

export type OnConnectorClickProps = {
  item: ConnectorType;
  configured: boolean;
};

const OAuthAppsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { workspaceId = '' } = useWorkspaceId();

  const {
    data: configuredConnectors,
    isLoading: isConfiguredConnectorsLoading,
    traceError: configuredConnectorsTraceError,
    error: configuredConnectorsError
  } = useFetch({
    query: useGetConfiguredConnectorsQuery(workspaceId, { refetchOnMountOrArgChange: true, skip: !workspaceId })
  });

  const {
    data: notConfiguredConnectors,
    isLoading: isNotConfiguredConnectorsLoading,
    traceError: notConfiguredConnectorsTraceError,
    error: notConfiguredConnectorsError
  } = useFetch({
    query: useGetNotConfiguredConnectorsQuery(workspaceId, { refetchOnMountOrArgChange: true, skip: !workspaceId })
  });

  const [connectorState, setConnectorState] = useState<OAuthConnectorsState>({
    type: '',
    configured: false
  });

  const handleItemOnClick = ({ item, configured = false }: OnConnectorClickProps) => {
    const { type } = item;
    setConnectorState((state) => ({
      ...state,
      type: type,
      configured: configured
    }));
    onSubmitClick({ type });
  };

  const onSubmitClick = ({ type }: { type: any }) => {
    const connector = type.split('_')[0] ?? '';

    type = type.split('_')[1];

    router.push(
      `${getBaseRoute(workspaceId as string)}/oauth-apps/${type.toLowerCase()}?connector=${connector.toLowerCase()}`
    );
  };

  const configured = getConnectors({ connectors: configuredConnectors });
  const notConfigured = getConnectors({ connectors: notConfiguredConnectors });

  return (
    <PageLayout pageHeadTitle="OAuth" title="" displayButton={false}>
      {configured.length > 0 && (
        <Grid item xs={12}>
          <OAuthApps
            key={`configuredApps`}
            handleItemOnClick={handleItemOnClick}
            connectorState={connectorState}
            state={{
              data: configured,
              error: configuredConnectorsError,
              isLoading: isConfiguredConnectorsLoading,
              title: 'CONFIGURED APPS',
              traceError: configuredConnectorsTraceError
            }}
          />
        </Grid>
      )}

      {notConfigured.length > 0 && (
        <Grid item xs={12} sx={{ mt: configured.length === 0 ? -1 : 3 }}>
          <OAuthApps
            key={`notConfiguredApps`}
            handleItemOnClick={handleItemOnClick}
            connectorState={connectorState}
            state={{
              data: notConfigured,
              error: notConfiguredConnectorsError,
              isLoading: isNotConfiguredConnectorsLoading,
              title: 'APPS THAT REQUIRE CONFIGURATION',
              traceError: notConfiguredConnectorsTraceError
            }}
          />
        </Grid>
      )}
    </PageLayout>
  );
};

OAuthAppsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default OAuthAppsPage;

const getConnectors = ({ connectors }: { connectors: ConnectorData }) => {
  const connectorsList: ConnectorType[] = flattenObjectValuesToArray(connectors);

  return connectorsList;
};
