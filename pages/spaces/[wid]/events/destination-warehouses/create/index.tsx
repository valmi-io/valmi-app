import React, { ReactElement, useState } from 'react';

import { useRouter } from 'next/router';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { Box, Grid, Paper, useTheme } from '@mui/material';
import { EventSourceType, extDestinations } from '@/constants/extDestinations';
import { getBaseRoute } from '@/utils/lib';
import ConnectorLayout from '@/layouts/ConnectorLayout';

import SubmitButton from '@/components/SubmitButton';
import CatalogCard from '@/content/Catalog/CatalogCard';

const CreateWarehousePage = () => {
  const theme = useTheme();
  const router = useRouter();

  const { wid } = router.query;

  const [selectedType, setSelectedType] = useState<string>('');

  const handleItemOnClick = ({ type }: EventSourceType) => {
    router.push(`${getBaseRoute(wid as string)}/events/destination-warehouses/create/${type}`);
  };

  return (
    <PageLayout pageHeadTitle={'Select warehouse'} title={'CONNECT TO WAREHOUSE'} displayButton={false}>
      <Paper>
        <ConnectorLayout title={''}>
          {/** Display page content */}
          <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {
              // Loop over extDestinations and display the icon
              Object.entries(extDestinations).map(([key, extDestination]) => {
                const { display_name, type, icon }: EventSourceType = extDestination;

                const displayName = display_name;

                const src = `/connectors/${icon}.svg`;

                return (
                  <CatalogCard
                    key={type}
                    src={src}
                    displayName={displayName}
                    catalog={extDestination}
                    handleCatalogOnClick={handleItemOnClick}
                  />
                );
              })
            }
          </Grid>
        </ConnectorLayout>
      </Paper>
    </PageLayout>
  );
};

CreateWarehousePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateWarehousePage;
