/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

/*
 * Destinations Page Component
 * This component represents a page for displaying destinations and creating new destination.
 */

import { ReactElement, useEffect } from 'react';

import { Card, Grid } from '@mui/material';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { RootState } from '@store/reducers';
import ErrorContainer from '@components/Error/ErrorContainer';
import SkeletonLoader from '../../../../src/components/SkeletonLoader';
import { getBaseRoute, isDataEmpty } from '../../../../src/utils/lib';
import { setDestinationFlowState } from '../../../../src/store/reducers/destinationFlow';
import ListEmptyComponent from '../../../../src/components/ListEmptyComponent';
import DestinationsTable from '../../../../src/content/DestinationWarehouses/DestinationsTable';
import { ErrorStatusText } from '../../../../src/components/Error';
import { useFetch } from '../../../../src/hooks/useFetch';
import { useGetDestinationsQuery } from '../../../../src/store/api/streamApiSlice';

const DestinationsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const dispatch = useDispatch();

  const { workspaceId = '' } = appState;

  const { data, isLoading, traceError, error } = useFetch({ query: useGetDestinationsQuery(workspaceId) });

  const handleButtonOnClick = ({ edit = false, id = '', type = '', supertype = '' }) => {
    dispatch(setDestinationFlowState({ editing: edit, id: id, type: type, supertype: supertype }));
    if (edit) {
      router.push(`${getBaseRoute(workspaceId)}/destination-warehouses/create/${type}`);
    } else {
      router.push(`${getBaseRoute(workspaceId)}/destination-warehouses/create`);
    }
  };

  const PageContent = () => {
    if (isDataEmpty(data)) {
      return <ListEmptyComponent description={'No destination warehouses found in this workspace'} />;
    }
    return (
      <DestinationsTable
        key={`destinationstable-${workspaceId}`}
        data={data}
        handleButtonOnClick={handleButtonOnClick}
      />
    );
  };

  return (
    <PageLayout
      pageHeadTitle="Warehouses"
      title="Destination Warehouses"
      buttonTitle="Warehouse"
      handleButtonOnClick={() => handleButtonOnClick({ edit: false, id: '', supertype: '', type: '' })}
    >
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined">
            {/** Display error */}
            {error && <ErrorContainer error={error} />}

            {/* Display trace error */}
            {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

            {/** Display skeleton */}
            <SkeletonLoader loading={isLoading} />

            {/** Display page content */}
            {!error && !isLoading && data && <PageContent />}
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

DestinationsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default DestinationsPage;
