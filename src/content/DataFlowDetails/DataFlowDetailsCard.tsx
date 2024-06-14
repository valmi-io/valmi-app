import React from 'react';

import { Paper, styled } from '@mui/material';

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
  gap: theme.spacing(1.5)
}));

const DataflowDetails = ({
  source,
  destination
}: {
  source: { type: string; name: string };
  destination: {
    type: string;
    name: string;
  };
}) => {
  return (
    <DataFlowContainer>
      <DataFlowCatalogCard type={source.type} name={source.name} />
      <CustomIcon icon={appIcons.ARROW_RIGHT} />
      <DataFlowCatalogCard type={destination.type} name={destination.name} />
    </DataFlowContainer>
  );
};

const DataFlowDetailsCard = ({ data, handleSwitchOnChange, handleEditSync }: DataFlowDetailsCardProps) => {
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
        />
        <DataFlowStatusCard data={data} status={status} handleSwitchOnChange={handleSwitchOnChange} />
      </DetailsContainer>
      <DataFlowScheduleCard run_interval={run_interval} />
    </CardWrapper>
  );
};

export default DataFlowDetailsCard;
