/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';

import { styled, darken } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import { ConnectorModel } from '@content/Connections/ConnectionModel';

import ImageComponent, { ImageSize } from '@components/ImageComponent';

interface ConnectorCardProps {
  item: ConnectorModel;
  handleConnectorOnClick: (data: ConnectorModel) => void;
  selectedConnectorType: string;
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,

  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: theme.spacing(2),
  textAlign: 'center'
}));

const ConnectorCard = ({
  item,
  handleConnectorOnClick,
  selectedConnectorType
}: ConnectorCardProps) => {
  const connectorType = item.type.split('_').slice(1).join('_');

  return (
    <Grid item xs={2} sm={4} md={4}>
      <Paper sx={{ borderRadius: 2, mx: 10 }} variant="outlined">
        <Item
          sx={{
            borderRadius: 2,
            backgroundColor: (theme) =>
              selectedConnectorType === item.type
                ? theme.colors.primary.main
                : darken(theme.colors.alpha.white[5], 1),
            color: (theme) =>
              selectedConnectorType === item.type
                ? theme.palette.success.contrastText
                : theme.palette.text.secondary
          }}
          onClick={() => handleConnectorOnClick(item)}
        >
          <ImageComponent
            src={`/connectors/${connectorType.toLowerCase()}.svg`}
            alt="connector"
            size={ImageSize.large}
            style={{ marginBottom: '14px' }}
          />
          {item.display_name}
        </Item>
      </Paper>
    </Grid>
  );
};

export default ConnectorCard;
