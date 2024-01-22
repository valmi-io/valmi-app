/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:44:22 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useState } from 'react';

import { useRouter } from 'next/router';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { Box, Grid, Paper, useTheme } from '@mui/material';
import { EventSourceType, extDestinations } from '@/constants/extDestinations';
import { getBaseRoute } from '@/utils/lib';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import ConnectorCard from '@/content/ConnectionFlow/Connectors/ConnectorCard';
import SubmitButton from '@/components/SubmitButton';

const CreateWarehousePage = () => {
  const theme = useTheme();
  const router = useRouter();

  const { wid } = router.query;

  const [selectedType, setSelectedType] = useState<string>('');

  const handleItemOnClick = ({ type }: EventSourceType) => {
    setSelectedType(type);
  };

  const onSubmitClick = () => {
    router.push(`${getBaseRoute(wid as string)}/destination-warehouses/create/${selectedType}`);
  };

  return (
    <PageLayout pageHeadTitle={'Select warehouse'} title={'Select warehouse'} displayButton={false}>
      <Paper variant="outlined">
        <ConnectorLayout title={''} layoutStyles={{ margin: theme.spacing(3) }}>
          {/** Display page content */}
          <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {
              // Loop over extDestinations and display the icon
              Object.entries(extDestinations).map(([key, extDestination]) => {
                const { display_name, type, icon }: EventSourceType = extDestination;
                let selected = selectedType === type ? true : false;

                const displayName = display_name;
                const src = `/connectors/${icon}.svg`;

                return (
                  <ConnectorCard
                    key={type}
                    item={extDestination}
                    handleConnectorOnClick={handleItemOnClick}
                    selected={selected}
                    src={src}
                    displayName={displayName}
                  />
                );
              })
            }
          </Grid>
        </ConnectorLayout>
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
            disabled={!selectedType}
            onClick={onSubmitClick}
          />
        </Box>
      </Paper>
    </PageLayout>
  );
};

CreateWarehousePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateWarehousePage;
