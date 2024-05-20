/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ChangeEvent, ReactElement, useState } from 'react';

import { useSelector } from 'react-redux';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { getLinkSelectors, useGetStreamsQuery, useGetDestinationsQuery } from '@/store/api/streamApiSlice';
import { RootState } from '@/store/reducers';
import { useFetch } from '@/hooks/useFetch';
import ContentLayout from '@/layouts/ContentLayout';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import FormLayout from '@/layouts/FormLayout';

import { LinkStateType } from '@/content/Events/CreateEventConnection';
import EventsFieldsControl from '@/content/Events/EventFieldsControl';
import EventInstructions from '@/content/Events/EventInstructions';
import { useTheme } from '@mui/material/styles';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const CreateEventXterior = () => {
  const theme = useTheme();

  const { workspaceId = '' } = useWorkspaceId();
  const { editing, id: linkId } = useSelector((state: RootState) => state.trackFlow);

  // Getting stream selectors for editing case specifically - not useful for create case
  const { selectAllLinks, selectLinkById } = getLinkSelectors(workspaceId as string);
  const linkData = useSelector((state) => selectLinkById(state, linkId));

  // linkObject refers to both source and destination.
  const [linkObj, setLinkObj] = useState<LinkStateType>({
    fromId: editing ? linkData?.fromId : '',
    toId: editing ? linkData?.toId : '',
    type: ''
  });

  const {
    data,
    isLoading,
    traceError: traceErrorStreams,
    error: errorStreams
  } = useFetch({ query: useGetStreamsQuery(workspaceId) });

  const {
    data: dataDestinations,
    isLoading: isLoadingDestinations,
    traceError: traceErrorDestinations,
    error: errorDestinations
  } = useFetch({ query: useGetDestinationsQuery(workspaceId) });

  const handleStreamOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLinkObj((linkObj) => ({
      ...linkObj,
      fromId: e.target.value
    }));
  };

  const handleDestinationOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLinkObj((linkObj) => ({
      ...linkObj,
      toId: e.target.value,
      type: dataDestinations.entities[e.target.value].destinationType
    }));
  };

  const PageContent = () => {
    return (
      <ConnectorLayout title={''} layoutStyles={{ marginTop: theme.spacing(2) }}>
        {/** Display Content */}
        <FormLayout
          formComp={
            <EventsFieldsControl
              key={`TrackFieldControl`}
              dataDestinations={dataDestinations}
              dataStreams={data}
              editing={!!editing}
              linkState={linkObj}
              onStreamChange={handleStreamOnChange}
              onDestinationChange={handleDestinationOnChange}
            />
          }
          instructionsComp={<EventInstructions data={{}} />}
        />
      </ConnectorLayout>
    );
  };

  return (
    <PageLayout
      pageHeadTitle={editing ? 'Edit Connection' : 'Create Connection'}
      title={editing ? 'Edit Connection' : 'Create a new Connection'}
      displayButtonInHeader={false}
    >
      <ContentLayout
        key={`createConnection`}
        error={errorStreams || errorDestinations}
        PageContent={<PageContent />}
        displayComponent={!errorStreams && !errorDestinations && !isLoading && !isLoadingDestinations}
        isLoading={isLoading}
        traceError={traceErrorStreams || traceErrorDestinations}
      />
    </PageLayout>
  );
};

CreateEventXterior.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateEventXterior;
