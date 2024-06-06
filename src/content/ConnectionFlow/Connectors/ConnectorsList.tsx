/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 31st 2024, 10:46:02 pm
 * Author: Nagendra S @ valmi.io
 */

import ConnectorCard from '@/content/ConnectionFlow/Connectors/ConnectorCard';
import { Grid } from '@mui/material';

export type ConnectorType = {
  display_name: string;
  docker_image: string;
  docker_tag: string;
  oauth?: boolean;
  type: string;
  connector_type?: string; // returned from backend
  oauth_keys?: 'private' | 'public';
  mode?: string[];
};

export type NewConnectorType = {
  display_name: string;
  oauth?: boolean;
  type: string;
  oauth_keys?: 'private' | 'public';
  oauth_params?: object; // added in ConnectorsPageContent
  oauth_error?: string;
};

const ConnectorsList = ({
  data,
  handleItemOnClick,
  selectedType,
  credentialsData
}: {
  data: ConnectorType[];
  handleItemOnClick: (item: ConnectorType) => void;
  selectedType: string;
  credentialsData: any;
}) => {
  const isNewConnection = (connection: any) => {
    const arr = credentialsData?.filter((item: any) => item?.connector_type === connection?.type);
    return arr?.length === 0 ? 0 : arr?.length;
  };
  return (
    <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {data.map((item: ConnectorType) => {
        const connectorType: string = item.type.split('_').slice(1).join('_');

        const selected = selectedType === item.type;

        const displayName = item.display_name;
        const src = `/connectors/${connectorType.toLowerCase()}.svg`;

        return (
          <ConnectorCard
            key={item.type}
            item={item}
            handleConnectorOnClick={handleItemOnClick}
            selected={selected}
            src={src}
            displayName={displayName}
            type={item.type.split('_')[0]}
            mode={item.mode}
            connections={isNewConnection(item)}
          />
        );
      })}
    </Grid>
  );
};

export default ConnectorsList;
