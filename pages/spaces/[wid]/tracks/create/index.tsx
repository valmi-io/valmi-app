/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import CreateDestination from './CreateLink';
import { getDestinationSelectors, getLinkSelectors, useGetDestinationsQuery, useGetStreamsQuery } from '../../../../../src/store/api/streamApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../src/store/reducers';
import { Card, List, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import SkeletonLoader from '../../../../../src/components/SkeletonLoader';

const CreateDestinationXterior = () => {
  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const { workspaceId = '' } = appState;
  const { editing, id: linkId } = useSelector((state: RootState) => state.trackFlow);

  // Getting stream selectors for editing case specifically - not useful for create case
  const { selectAllLinks, selectLinkById } = getLinkSelectors(workspaceId as string);
  const linkData = useSelector((state) => selectLinkById(state, linkId));

  const [fromId, setFromId] = useState(editing ? linkData.fromId : '');
  const [toId, setToId] = useState(editing ? linkData.toId : '');
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
        <Card sx={{ padding: 2 }} variant="outlined">
          {!editing && (
            <>
              <Select
                sx={{ margin: 2 }}
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
                sx={{ margin: 2 }}
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
            </>
          )}

          {(type || editing) && <CreateDestination key={fromId+toId} type={type} fromId={fromId} toId={toId} />}
        </Card>
      )}
    </PageLayout>
  );
};

CreateDestinationXterior.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateDestinationXterior;
