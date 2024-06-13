/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 18th 2023, 1:25:40 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';

import { Box, Button, Chip, Paper, Stack, Switch, Typography, styled } from '@mui/material';

import ConnectionCard from '@content/Syncs/SyncDetails/ConnectionCard';

import { StackLayout } from '@components/Layouts/Layouts';

import { convertDurationToMinutesOrHours } from '@utils/lib';
import appIcons from '@utils/icon-utils';
import CustomIcon from '@components/Icon/CustomIcon';

type SyncDetailsCardProps = {
  syncData: any;
  handleSyncSwitch: (event: any, checked: boolean, data: any) => void;
  handleEditSync: (data: any) => void;
  isPublicSync?: boolean;
};

const CardWrapper = styled(Paper)(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2)
}));

const DetailsContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  gap: theme.spacing(1)
}));

const ScheduleInfoContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
  marginLeft: 3
}));

const SyncDetailsCard = ({
  syncData,
  handleSyncSwitch,
  handleEditSync,
  isPublicSync = false
}: SyncDetailsCardProps) => {
  const {
    name: syncName = '',
    schedule: { run_interval = 0 } = {},
    status = '',
    source: { name: sourceName = '', credential: { connector_type: sourceConnectionType = '' } = {} } = {},
    destination: {
      name: destinationName = '',
      credential: { connector_type: destinationConnectionType = '' } = {}
    } = {}
  } = syncData || {};

  return (
    <CardWrapper variant="outlined">
      <DetailsContainer>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            gap: '10px'
          }}
        >
          <ConnectionCard
            connectionType={isPublicSync ? 'SRC_POSTGRES' : sourceConnectionType}
            connectionTitle={isPublicSync ? '"dvdrental"."public"."one_m_data"' : sourceName}
          />
          <CustomIcon icon={appIcons.ARROW_RIGHT} />
          <ConnectionCard
            connectionType={isPublicSync ? 'DEST_WEBHOOK' : destinationConnectionType}
            connectionTitle={isPublicSync ? process.env.PUBLIC_SYNC_URL : destinationName}
          />
        </Paper>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            gap: '10px'
          }}
        >
          <Typography variant="body1" sx={{ color: (theme) => theme.colors.primary.main }}>
            {isPublicSync ? 'ACTIVE' : status.toUpperCase()}
          </Typography>
          {!isPublicSync && (
            <Switch
              size="medium"
              checked={status === 'active' ? true : false}
              onChange={(event, checked) => {
                handleSyncSwitch(event, checked, syncData);
              }}
            />
          )}
        </Paper>
      </DetailsContainer>
      <ScheduleInfoContainer>
        <CustomIcon icon={appIcons.SCHEDULE} />
        <Typography variant="body2">{`Every ${convertDurationToMinutesOrHours(
          isPublicSync ? '18000000' : run_interval
        )}`}</Typography>

        {/* {!isPublicSync && (
          <>
            <Button
              variant="text"
              // onClick={() => handleEditSync(syncData)}
            >
              {'EDIT'}
            </Button>
          </>
        )} */}
      </ScheduleInfoContainer>
    </CardWrapper>
  );
};

export default SyncDetailsCard;
