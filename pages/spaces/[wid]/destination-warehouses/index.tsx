/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

/*
 * Destinations Page Component
 * This component represents a page for displaying destinations and creating new destination.
 */

import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { RootState } from '@store/reducers';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import DestinationsTable from '@/content/DestinationWarehouses/DestinationsTable';
import { useFetch } from '@/hooks/useFetch';
import { useGetAnalyticsDestinationsQuery, useGetDestinationsQuery } from '@/store/api/streamApiSlice';
import { setDestinationFlowState } from '@/store/reducers/destinationFlow';
import { getBaseRoute, isDataEmpty } from '@/utils/lib';
import ContentLayout from '@/layouts/ContentLayout';
import AnalyticsDestinationsTable from '@/content/AnalyticsDestinations/AnalyticsDestinationsTable';

const DestinationsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { id = '' } = router.query;

  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const dispatch = useDispatch();

  const { workspaceId = '' } = appState;

  const { data, isLoading, traceError, error } = useFetch({ query: useGetDestinationsQuery(workspaceId) });
  const { data : data1, isLoading: isLoading1, traceError : traceError1, error: error1 } = useFetch({ query: useGetAnalyticsDestinationsQuery(workspaceId) });

  const handleButtonOnClick = ({ edit = false, id = '', type = '', supertype = '' }) => {
    dispatch(setDestinationFlowState({ editing: edit, id: id, type: type, supertype: supertype }));
    if (edit) {
      router.push(`${getBaseRoute(workspaceId)}/destination-warehouses/create/${type}`);
    } else {
      router.push(`${getBaseRoute(workspaceId)}/destination-warehouses/create`);
    }
  };
  const handleButtonOnClickAnalyticsDestination = ({ edit = false, id = '', type = '', supertype = '' }) => {
    dispatch(setDestinationFlowState({ editing: edit, id: id, type: type, supertype: supertype }));
    if (edit) {
      router.push(`${getBaseRoute(workspaceId)}/destination-warehouses/analytics-destinations/create/${type}`);
    } else {
      router.push(`${getBaseRoute(workspaceId)}/destination-warehouses/analytics-destinations/create`);
    }
  };

  const PageContentForWarehouses = () => {
    if (isDataEmpty(data)) {
      return <ListEmptyComponent description={'No destination warehouses found in this workspace'} />;
    }
    return (
      <DestinationsTable
        key={`destinationstable-${workspaceId}`}
        data={data}
        id={id}
        handleButtonOnClick={handleButtonOnClick}
      />
    );
  };
  const PageContentForAnalyticsDestinations = () => {
    if (isDataEmpty(data)) {
      return <ListEmptyComponent description={'No analytics destinations found in this workspace'} />;
    }
    return (
      <AnalyticsDestinationsTable
        key={`analytcsdestinationstable-${workspaceId}`}
        data={data}
        id={id}
        handleButtonOnClick={handleButtonOnClickAnalyticsDestination}
      />
    );
  };

  return (
    <>
    <PageLayout
      pageHeadTitle="Warehouses"
      title="Destination Warehouses"
      buttonTitle="Warehouse"
      handleButtonOnClick={() => handleButtonOnClick({ edit: false, id: '', supertype: '', type: '' })}
      >
      <ContentLayout
        key={`destinationsWarehousesPage`}
        error={error}
        PageContent={<PageContentForWarehouses />}
        displayComponent={!error && !isLoading && data}
        isLoading={isLoading}
        traceError={traceError}
        />
    </PageLayout>
    <PageLayout
      pageHeadTitle="Analytics Destinations"
      title="Analytics Destinations"
      buttonTitle="Analytics Destination"
      handleButtonOnClick={() => handleButtonOnClickAnalyticsDestination({ edit: false, id: '', supertype: '', type: '' })}
      >
      <ContentLayout
        key={`destinationsAnalyticsPage`}
        error={error1}
        PageContent={<PageContentForAnalyticsDestinations />}
        displayComponent={!error1 && !isLoading1 && data1}
        isLoading={isLoading1}
        traceError={traceError1}
        />
    </PageLayout>
    </>
  );
};

DestinationsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default DestinationsPage;
