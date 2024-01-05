/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useState } from 'react';

import { useSelector } from 'react-redux';
import { MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import CreateTrack from '@/content/Tracks/CreateTrack';
import { getLinkSelectors, useGetStreamsQuery, useGetDestinationsQuery } from '@/store/api/streamApiSlice';
import { RootState } from '@/store/reducers';
import { useFetch } from '@/hooks/useFetch';
import ContentLayout from '@/layouts/ContentLayout';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import Instructions from '@/components/Instructions';
import FormLayout, { FormContainer } from '@/layouts/FormLayout';

const CreateTrackXterior = () => {
  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const { workspaceId = '' } = appState;
  const { editing, id: linkId } = useSelector((state: RootState) => state.trackFlow);

  // Getting stream selectors for editing case specifically - not useful for create case
  const { selectAllLinks, selectLinkById } = getLinkSelectors(workspaceId as string);
  const linkData = useSelector((state) => selectLinkById(state, linkId));

  const [fromId, setFromId] = useState(editing ? linkData?.fromId : '');
  const [toId, setToId] = useState(editing ? linkData?.toId : '');
  const [type, setType] = useState('');

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

  const FormFields = () => {
    return (
      <FormContainer>
        {!editing && (
          <Stack spacing={1}>
            <Select
              fullWidth
              id="fromIDComponent"
              onChange={(event: SelectChangeEvent) => {
                setFromId(event.target.value);
              }}
              value={fromId}
            >
              {data.ids.map((id: string) => {
                return (
                  <MenuItem key={id} value={id}>
                    {data.entities[id].name}
                  </MenuItem>
                );
              })}
            </Select>
            <br />
            <Select
              fullWidth
              id="toIDComponent"
              onChange={(event: SelectChangeEvent) => {
                setToId(event.target.value);
                setType(dataDestinations.entities[event.target.value].destinationType);
              }}
              value={toId}
            >
              {dataDestinations.ids.map((id: string) => {
                return (
                  <MenuItem key={id} value={id}>
                    {dataDestinations.entities[id].name}
                  </MenuItem>
                );
              })}
            </Select>
          </Stack>
        )}

        {(type || editing) && <CreateTrack key={fromId + toId} type={type} fromId={fromId} toId={toId} />}
      </FormContainer>
    );
  };

  const InstructionsContent = () => {
    const documentationUrl = 'https://www.valmi.io/docs/overview';
    const title = 'Tracks';
    const linkText = 'tracks.';

    return <Instructions documentationUrl={documentationUrl} title={title} linkText={linkText} type={'track'} />;
  };

  const PageContent = () => {
    return (
      <ConnectorLayout title={''} layoutStyles={{ marginTop: 0 }}>
        {/** Display Content */}
        <FormLayout formComp={<FormFields />} instructionsComp={<InstructionsContent />} />
      </ConnectorLayout>
    );
  };

  return (
    <PageLayout pageHeadTitle={'Create Track'} title={'Create a new Track'} displayButton={false}>
      <ContentLayout
        key={`createTrack`}
        error={errorStreams || errorDestinations}
        PageContent={<PageContent />}
        displayComponent={!errorStreams && !errorDestinations && !isLoading && !isLoadingDestinations}
        isLoading={isLoading}
        traceError={traceErrorStreams || traceErrorDestinations}
      />
    </PageLayout>
  );
};

CreateTrackXterior.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateTrackXterior;
