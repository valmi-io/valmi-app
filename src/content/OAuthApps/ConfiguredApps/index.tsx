/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, January 25th 2024, 10:12:19 am
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import SidebarLayout from '@layouts/SidebarLayout';

import { RootState } from '@store/reducers';
import { useFetch } from '@/hooks/useFetch';
import { findIntersection, findUniqueElements, flattenObjectValuesToArray, getBaseRoute } from '@/utils/lib';
import { useFetchConnectorsQuery } from '@/store/api/apiSlice';
import { Box, Grid, Stack } from '@mui/material';
import SubmitButton from '@/components/SubmitButton';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import ConnectorCard from '@/content/ConnectionFlow/Connectors/ConnectorCard';
import { useGetOAuthApiConfigQuery } from '@/store/api/oauthApiSlice';
import { AppDispatch, AppState } from '@/store/store';
import { setOAuthFlowState } from '@/store/reducers/oAuthFlow';
import ContentLayout from '@/layouts/ContentLayout';

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

const ConfiguredApps: NextPageWithLayout = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const appState: AppState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const { data, isLoading, error, traceError } = useFetch({
    query: useFetchConnectorsQuery({}, { refetchOnMountOrArgChange: true })
  });

  // get OAuth configurations
  const {
    data: oauthConfigData,
    isLoading: isOAuthConfigLoading,
    traceError: oAuthConfigTraceError,
    error: oAuthConfigError
  } = useFetch({ query: useGetOAuthApiConfigQuery(workspaceId, { refetchOnMountOrArgChange: true }) });

  const [state, setState] = useState<{ isLoading: boolean; traceError: any; error: any }>({
    isLoading: false,
    traceError: null,
    error: null
  });

  const [connectorState, setConnectorState] = useState<{
    connectors: ConnectorType[];
    configuredConnectors: ConnectorType[];
    type: string; // selected connector type
    configured: boolean; // is selected connector configured
  }>({
    connectors: [],
    configuredConnectors: [],
    type: '',
    configured: false
  });

  useEffect(() => {
    setState((state) => ({
      ...state,
      isLoading: isOAuthConfigLoading || isLoading
    }));
  }, [isOAuthConfigLoading, isLoading]);

  useEffect(() => {
    if (oAuthConfigError || error) {
      setState((state) => ({
        ...state,
        error: oAuthConfigError || error
      }));
    }
  }, [oAuthConfigError, error]);

  useEffect(() => {
    if (oAuthConfigTraceError || traceError) {
      setState((state) => ({
        ...state,
        traceError: oAuthConfigTraceError || traceError
      }));
    }
  }, [oAuthConfigTraceError, traceError]);

  useEffect(() => {
    if (data && oauthConfigData) {
      const { configuredConnectors, connectors } = getProcessedData({ connectors: data, oAuthConfig: oauthConfigData });

      setConnectorState((state) => ({
        ...state,
        configuredConnectors: configuredConnectors,
        connectors: connectors
      }));
    }
  }, [data, oauthConfigData]);

  const handleItemOnClick = ({ item, configured = false }: { item: ConnectorType; configured: boolean }) => {
    const { type } = item;
    setConnectorState((state) => ({
      ...state,
      type: type,
      configured: configured
    }));
  };

  const onSubmitClick = () => {
    const { type, configured } = connectorState;
    dispatch(setOAuthFlowState({ editing: configured }));
    router.push(`${getBaseRoute(workspaceId as string)}/oauth-apps/${type}`);
  };

  const PageContent = () => {
    const { configuredConnectors = [], type } = connectorState;

    return (
      <>
        <ConnectorLayout title={''}>
          {/** Display page content */}

          {/** configured connectors */}
          <Stack sx={{ display: 'flex' }} spacing={3}>
            <Connectors
              key={`configuredConnectors`}
              data={configuredConnectors}
              handleItemOnClick={(item) => handleItemOnClick({ item, configured: true })}
              selectedType={type}
            />
          </Stack>
        </ConnectorLayout>
        <Box
          sx={{
            margin: (theme) => theme.spacing(2),
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
        >
          <SubmitButton buttonText={'Next'} data={null} isFetching={false} disabled={!type} onClick={onSubmitClick} />
        </Box>
      </>
    );
  };

  return (
    <ContentLayout
      key={`configuredoauthapps`}
      error={error || oAuthConfigError}
      PageContent={<PageContent />}
      displayComponent={!state.error && !state.isLoading && oauthConfigData}
      isLoading={state.isLoading}
      traceError={traceError || oAuthConfigTraceError}
    />
  );
};

ConfiguredApps.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default ConfiguredApps;

const Connectors = ({
  data,
  handleItemOnClick,
  selectedType
}: {
  data: ConnectorType[];
  handleItemOnClick: (item: ConnectorType) => void;
  selectedType: string;
}) => {
  return (
    <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {data.map((item: ConnectorType) => {
        const connectorType: string = item.type.split('_').slice(1).join('_');

        const selected = selectedType === item.type;

        const displayName = item.display_name;
        const src = `/connectors/${connectorType.toLowerCase()}.svg`;

        return (
          <ConnectorCard
            key={item.type}
            item={item}
            handleConnectorOnClick={handleItemOnClick}
            selected={selected}
            src={src}
            displayName={displayName}
          />
        );
      })}
    </Grid>
  );
};

const getProcessedData = ({ connectors, oAuthConfig }: { connectors: ConnectorData; oAuthConfig: any }) => {
  const connectorsList: ConnectorType[] = flattenObjectValuesToArray(connectors);

  return {
    configuredConnectors: findIntersection(connectorsList, oAuthConfig.ids, 'type'),
    connectors: findUniqueElements(connectorsList, oAuthConfig.ids, 'type')
  };
};
