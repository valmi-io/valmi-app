/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';

import { styled, darken, Chip, Stack, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import { ConnectorModel } from '@content/Connections/ConnectionModel';

import ImageComponent, { ImageSize } from '@components/ImageComponent';
import { EventSourceType } from '@/constants/extDestinations';
import CustomIcon from '@/components/Icon/CustomIcon';
import appIcons from '@/utils/icon-utils';

interface ConnectorCardProps {
  item: ConnectorModel | EventSourceType;
  handleConnectorOnClick: (data: any) => void;
  selected?: boolean;
  src: string;
  displayName: string;
  type?: string;
  mode?: string[];
}

export const ConnectorItem = styled(Paper)(({ theme }) => ({
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
  selected = false,
  src = '',
  displayName = '',
  type = 'src',
  mode
}: ConnectorCardProps) => {
  return (
    <Grid item xs={'auto'} sm={4} md={4}>
      <Paper sx={{ borderRadius: 2, mx: 6, my: 2 }} variant="outlined">
        <ConnectorItem
          sx={{
            borderRadius: 2,
            backgroundColor: (theme) => (selected ? theme.colors.primary.main : darken(theme.colors.alpha.white[5], 1)),
            color: (theme) => (selected ? theme.palette.success.contrastText : theme.palette.text.secondary)
          }}
        >
          <IconButton
            sx={{ ml: 2, alignSelf: 'flex-end' }}
            color="primary"
            onClick={() => handleConnectorOnClick(item)}
          >
            <CustomIcon style={{ fontSize: ImageSize.small }} icon={appIcons.CIRCLE_PLUS_OUTLINED} />
          </IconButton>
          <ImageComponent src={src} alt="connector" size={ImageSize.large} style={{ marginBottom: '14px' }} />
          {displayName}
          <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center', mt: 1 }}>
            <Chip label={type?.toLocaleLowerCase()} size="small" />
            {mode?.map((item) => (
              <Chip key={item} label={item?.toLocaleLowerCase()} size="small" />
            ))}
          </Stack>
        </ConnectorItem>
      </Paper>
    </Grid>
  );
};

export default ConnectorCard;
