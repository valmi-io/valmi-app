/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 18th 2023, 1:25:40 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';

import { Box, Chip, Stack, Switch, Typography } from '@mui/material';

import { StackLayout } from '../../../components/Layouts/Layouts';

import { convertDurationToMinutesOrHours } from '../../../utils/lib';
import appIcons from '../../../utils/icon-utils';
import ConnectionCard from './ConnectionCard';

type SyncDetailsCardProps = {
  syncData: any;
  handleSyncSwitch: (event: any, checked: boolean, data: any) => void;
  handleEditSync: (data: any) => void;
};

const SyncDetailsCard = ({
  syncData,
  handleSyncSwitch,
  handleEditSync
}: SyncDetailsCardProps) => {
  const {
    name: syncName = '',
    schedule: { run_interval = 0 } = {},
    status = '',
    source: {
      name: sourceName = '',
      credential: { connector_type: sourceConnectionType = '' } = {}
    } = {},
    destination: {
      name: destinationName = '',
      credential: { connector_type: destinationConnectionType = '' } = {}
    } = {}
  } = syncData || {};

  return (
    <StackLayout spacing={2}>
      {/** Sync name */}
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Stack spacing={0.5} direction="row" alignItems="center">
          {appIcons.NAME}

          <Typography variant="body2">{`${syncName}`}</Typography>
        </Stack>
        <Stack
          spacing={0.5}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Chip
            color={status === 'active' ? 'secondary' : 'warning'}
            label={status}
          />

          <Switch
            size="medium"
            checked={status === 'active' ? true : false}
            onChange={(event, checked) => {
              handleSyncSwitch(event, checked, syncData);
            }}
          />
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        {/** Source -  Destination */}
        <Stack
          display="flex"
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Stack display="flex" direction="row" alignItems="center" spacing={3}>
            <ConnectionCard
              connectionType={sourceConnectionType}
              connectionTitle={sourceName}
            />

            {/* right arrow icon */}
            {appIcons.ARROW_RIGHT}

            <ConnectionCard
              connectionType={destinationConnectionType}
              connectionTitle={destinationName}
            />
          </Stack>
          {/** Schedule */}
        </Stack>
        <Stack display="flex" direction="column" justifyContent="space-between">
          <Stack spacing={0.5} direction="row">
            {appIcons.SCHEDULE}
            <Typography variant="body2">{`Every ${convertDurationToMinutesOrHours(
              run_interval
            )}`}</Typography>
          </Stack>

          <Stack spacing={0.5} direction="row">
            {appIcons.EDIT}
            <Typography
              onClick={() => handleEditSync(syncData)}
              variant="body2"
              sx={{
                color: (theme) => theme.colors.primary.main,
                cursor: 'pointer'
              }}
            >
              {'SYNC'}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </StackLayout>
  );
};

export default SyncDetailsCard;
