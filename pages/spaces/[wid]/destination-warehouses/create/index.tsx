/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:44:22 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement } from 'react';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { Card, CardActionArea, CardContent, CardMedia, ExtendButton, Grid, Typography } from '@mui/material';
import ImageComponent, { ImageSize } from '../../../../../src/components/ImageComponent';
import { extDestinations } from '../../../../../src/constants/extDestinations';
import { useRouter } from 'next/router';
import { getBaseRoute } from '../../../../../src/utils/lib';

const CreateWarehousePage = () => {
  const router = useRouter();

  const {wid} = router.query;

  return (
    <PageLayout pageHeadTitle={'Create warehouse'} title={'Create a new warehouse'} displayButton={false}>
      {
        // Loop over extDestinations and display the icon
        Object.entries(extDestinations).map(([key, extDestination]) => {
          const {name, type, icon} = extDestination;

          return (
             <Card key={key}>
                <CardActionArea onClick={() =>{

                router.push(`${getBaseRoute(wid as string)}/destination-warehouses/create/${type}`)}}>
                  <ImageComponent src={`/connectors/${icon}.svg`} alt={'warehouse'} size={ImageSize.large} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
           );
        }
        )
      }
    </PageLayout>
  );
};

CreateWarehousePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateWarehousePage;
