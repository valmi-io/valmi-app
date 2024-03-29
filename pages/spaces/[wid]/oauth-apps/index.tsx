/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 23rd 2024, 12:44:57 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { RootState } from '@store/reducers';
import { useFetch } from '@/hooks/useFetch';
import { flattenObjectValuesToArray, getBaseRoute } from '@/utils/lib';
import { Box, Grid } from '@mui/material';
import SubmitButton from '@/components/SubmitButton';
import { useGetConfiguredConnectorsQuery, useGetNotConfiguredConnectorsQuery } from '@/store/api/oauthApiSlice';
import { AppDispatch, AppState } from '@/store/store';

import OAuthApps from '@/content/OAuthApps';

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

  const appState: AppState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const {
    data: configuredConnectors,
    isLoading: isConfiguredConnectorsLoading,
    traceError: configuredConnectorsTraceError,
    error: configuredConnectorsError
  } = useFetch({ query: useGetConfiguredConnectorsQuery(workspaceId, { refetchOnMountOrArgChange: true }) });

  const {
    data: notConfiguredConnectors,
    isLoading: isNotConfiguredConnectorsLoading,
    traceError: notConfiguredConnectorsTraceError,
    error: notConfiguredConnectorsError
  } = useFetch({ query: useGetNotConfiguredConnectorsQuery(workspaceId, { refetchOnMountOrArgChange: true }) });

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
  };

  const onSubmitClick = () => {
    let { type = '' } = connectorState;

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
              title: 'Configured Apps',
              traceError: configuredConnectorsTraceError
            }}
          />
        </Grid>
      )}

      {notConfigured.length > 0 && (
        <Grid item xs={12} sx={{ mt: 3 }}>
          <OAuthApps
            key={`notConfiguredApps`}
            handleItemOnClick={handleItemOnClick}
            connectorState={connectorState}
            state={{
              data: notConfigured,
              error: notConfiguredConnectorsError,
              isLoading: isNotConfiguredConnectorsLoading,
              title: 'Apps that require configuration',
              traceError: notConfiguredConnectorsTraceError
            }}
          />
        </Grid>
      )}
      <Box
        sx={{
          margin: (theme) => theme.spacing(2),
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end'
        }}
      >
        <SubmitButton
          buttonText={'Next'}
          data={null}
          isFetching={false}
          disabled={!connectorState.type}
          onClick={onSubmitClick}
        />
      </Box>
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
