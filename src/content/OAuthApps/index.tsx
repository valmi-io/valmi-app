/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, January 25th 2024, 10:12:48 am
 * Author: Nagendra S @ valmi.io
 */

import ContentLayout from '@/layouts/ContentLayout';
import { Stack } from '@mui/material';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import PageTitle from '@/components/PageTitle';
import { OAuthConnectorsState, OnConnectorClickProps } from '@/pagesspaces/[wid]/oauth-apps';
import ConnectorsList from '@/content/ConnectionFlow/Connectors/ConnectorsList';

type LayoutState = {
  isLoading: boolean;
  data: any;
  error: any;
  traceError: any;
  title: string;
};

type OAuthAppProps = {
  state: LayoutState;
  handleItemOnClick: (data: OnConnectorClickProps) => void;
  connectorState: OAuthConnectorsState;
};

const OAuthApps = ({ state, handleItemOnClick, connectorState }: OAuthAppProps) => {
  const { data, error, isLoading, title, traceError } = state;

  const PageContent = () => {
    const { type } = connectorState;

    return (
      <>
        <ConnectorLayout title="">
          {/** Display page content */}

          <Stack sx={{ display: 'flex' }} spacing={3}>
            {/** connectors */}
            <ConnectorsList
              key={`oauthconnectorsList-${state.title}`}
              data={data}
              handleItemOnClick={(item) => handleItemOnClick({ item, configured: false })}
              selectedType={type}
            />
          </Stack>
        </ConnectorLayout>
      </>
    );
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <PageTitle title={title} displayButton={false} />
      <ContentLayout
        key={`${title}`}
        error={error}
        PageContent={<PageContent />}
        displayComponent={!error && !isLoading && data}
        isLoading={isLoading}
        traceError={traceError}
      />
    </Stack>
  );
};

export default OAuthApps;
