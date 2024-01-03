/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useState } from 'react';

import { useSelector } from 'react-redux';
import { Card, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import SkeletonLoader from '@/components/SkeletonLoader';
import CreateTrack from '@/content/Tracks/CreateTrack';
import { getLinkSelectors, useGetStreamsQuery, useGetDestinationsQuery } from '@/store/api/streamApiSlice';
import { RootState } from '@/store/reducers';

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

  const { data, isLoading, isSuccess, isError, error } = useGetStreamsQuery(workspaceId);

  const {
    data: dataDestinations,
    isLoading: isLoadingDestinations,
    isSuccess: isSuccessDestinations,
    isError: isErrorDestinations,
    error: errorDestinations
  } = useGetDestinationsQuery(workspaceId);

  return (
    <PageLayout pageHeadTitle={'Create Track'} title={'Create a new Track'} displayButton={false}>
      {(isLoading || isLoadingDestinations) && <SkeletonLoader loading={isLoading} />}

      {!isLoading && !isLoadingDestinations && (
        <Card sx={{ padding: (theme) => theme.spacing(2) }} variant="outlined">
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
        </Card>
      )}
    </PageLayout>
  );
};

CreateTrackXterior.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateTrackXterior;
