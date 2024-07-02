import React from 'react';

import { Paper, Typography, styled } from '@mui/material';

import appIcons from '@utils/icon-utils';
import CustomIcon from '@components/Icon/CustomIcon';
import DataFlowCatalogCard from '@/content/DataFlowDetails/DataFlowCatalogCard';
import { TConnection } from '@/utils/typings.d';
import DataFlowStatusCard from '@/content/DataFlowDetails/DataFlowStatusCard';
import DataFlowScheduleCard from '@/content/DataFlowDetails/DataFlowScheduleCard';

type DataFlowDetailsCardProps = {
  data: TConnection;
  handleSwitchOnChange: (event: any, checked: boolean, data: any) => void;
  handleEditSync: (data: any) => void;
  isPublicSync: boolean;
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

const DataFlowContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  width: '100%'
}));

const DataflowDetails = ({
  source,
  destination,
  isPublicSync
}: {
  source: { type: string; name: string };
  destination: {
    type: string;
    name: string;
  };
  isPublicSync: boolean;
}) => {
  return (
    <>
      <DataFlowContainer>
        <DataFlowCatalogCard
          type={isPublicSync ? 'SRC_POSTGRES' : source.type}
          name={isPublicSync ? '"dvdrental"."public"."one_m_data"' : source.name}
        />
        <CustomIcon icon={appIcons.ARROW_RIGHT} />
        <DataFlowCatalogCard
          type={isPublicSync ? 'DEST_WEBHOOK' : destination.type}
          name={isPublicSync ? process.env.PUBLIC_SYNC_URL : destination.name}
        />
      </DataFlowContainer>
    </>
  );
};

const DataFlowDetailsCard = ({
  data,
  handleSwitchOnChange,
  handleEditSync,
  isPublicSync = false
}: DataFlowDetailsCardProps) => {
  const {
    schedule: { run_interval = 0 } = {},
    status = '',
    source: { name: sourceName = '', credential: { connector_type: sourceConnectionType = '' } = {} } = {},
    destination: {
      name: destinationName = '',
      credential: { connector_type: destinationConnectionType = '' } = {}
    } = {}
  } = data || {};

  return (
    <CardWrapper variant="outlined">
      <DetailsContainer>
        <DataflowDetails
          source={{ name: sourceName, type: sourceConnectionType }}
          destination={{ name: destinationName, type: destinationConnectionType }}
          isPublicSync={isPublicSync}
        />
        <DataFlowStatusCard
          data={data}
          status={status}
          handleSwitchOnChange={handleSwitchOnChange}
          isPublicSync={isPublicSync}
        />
      </DetailsContainer>
      <DataFlowScheduleCard run_interval={run_interval} isPublicSync={isPublicSync} />
    </CardWrapper>
  );
};

export default DataFlowDetailsCard;
