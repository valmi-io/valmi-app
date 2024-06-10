/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, January 25th 2024, 10:12:48 am
 * Author: Nagendra S @ valmi.io
 */

import ContentLayout from '@/layouts/ContentLayout';
import { Grid, Stack } from '@mui/material';
import PageTitle from '@/components/PageTitle';
import { OAuthConnectorsState, OnConnectorClickProps } from '@/pagesspaces/[wid]/oauth-apps';
import { TCatalog } from '@/utils/typings.d';
import CatalogCard from '@/content/Catalog/CatalogCard';

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

const PageContent = ({
  connectorState,
  catalogs,
  handleItemOnClick
}: {
  connectorState: any;
  catalogs: TCatalog[];
  handleItemOnClick: (data: any) => void;
}) => {
  return (
    <>
      {/** Display page content */}

      <Stack sx={{ display: 'flex' }} spacing={3}>
        {/** connectors */}
        <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {catalogs.map((catalog: TCatalog) => {
            return (
              <CatalogCard
                key={catalog.type}
                catalog={catalog}
                handleCatalogOnClick={(item) => handleItemOnClick({ item, configured: false })}
              />
            );
          })}
        </Grid>
      </Stack>
    </>
  );
};

const OAuthApps = ({ state, handleItemOnClick, connectorState }: OAuthAppProps) => {
  const { data, error, isLoading, title, traceError } = state;

  return (
    <Stack sx={{ gap: 2 }}>
      <PageTitle title={title} displayButton={false} />
      <ContentLayout
        key={`${title}`}
        error={error}
        PageContent={
          <PageContent connectorState={connectorState} catalogs={data} handleItemOnClick={handleItemOnClick} />
        }
        displayComponent={!error && !isLoading && data}
        isLoading={isLoading}
        traceError={traceError}
      />
    </Stack>
  );
};

export default OAuthApps;
