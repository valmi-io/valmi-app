/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:44:22 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement } from 'react';

import { useRouter } from 'next/router';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { Grid, Paper, darken } from '@mui/material';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import { extDestinations } from '@/constants/extDestinations';
import { getBaseRoute } from '@/utils/lib';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import { ConnectorItem } from '@/content/ConnectionFlow/Connectors/ConnectorCard';

const CreateWarehousePage = () => {
  const router = useRouter();

  const { wid } = router.query;

  const handleItemOnClick = (type: string) => {
    router.push(`${getBaseRoute(wid as string)}/destination-warehouses/create/${type}`);
  };

  return (
    <PageLayout pageHeadTitle={'Create Destination'} title={'Create a new destination'} displayButton={false}>
      <ConnectorLayout title={''}>
        {/** Display page content */}
        <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {
            // Loop over extDestinations and display the icon
            Object.entries(extDestinations).map(([key, extDestination]) => {
              const { name, type, icon } = extDestination;
              return (
                <Grid key={key} item xs={2} sm={4} md={4}>
                  <Paper sx={{ borderRadius: 2, mx: 10 }} variant="outlined">
                    <ConnectorItem
                      sx={{
                        borderRadius: 2,
                        backgroundColor: (theme) => darken(theme.colors.alpha.white[5], 1),
                        color: (theme) => theme.palette.text.secondary
                      }}
                      onClick={() => handleItemOnClick(type)}
                    >
                      <ImageComponent
                        src={`/connectors/${icon}.svg`}
                        alt="connector"
                        size={ImageSize.large}
                        style={{ marginBottom: '14px' }}
                      />
                      {name}
                    </ConnectorItem>
                  </Paper>
                </Grid>
              );
            })
          }
        </Grid>
      </ConnectorLayout>
    </PageLayout>
  );
};

CreateWarehousePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateWarehousePage;
