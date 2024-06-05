/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import React from 'react';

import { styled, darken, Chip, Stack, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import { ConnectorModel } from '@content/Connections/ConnectionModel';

import ImageComponent, { ImageSize } from '@components/ImageComponent';
import { EventSourceType } from '@/constants/extDestinations';
import CustomIcon from '@/components/Icon/CustomIcon';
import appIcons from '@/utils/icon-utils';
import SubmitButton from '@/components/SubmitButton';

interface ConnectorCardProps {
  item: ConnectorModel | EventSourceType;
  handleConnectorOnClick: (data: any) => void;
  selected?: boolean;
  src: string;
  displayName: string;
  type?: string;
  mode?: string[];
}

const CardWrapper = styled(Paper)(({ theme }) => ({
  boxSizing: 'border-box',
  width: '144px',
  height: '144px',
  backgroundColor: theme.colors.secondary.lighter,
  position: 'relative'
}));

export const ConnectorItem = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  gap: theme.spacing(1),
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: 'transparent'
}));

const CardFooter = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(1),
  width: '100%',
  position: 'absolute',
  right: 0,
  bottom: '-4px',
  backgroundColor: 'transparent'
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
    <Grid item xs={'auto'}>
      <CardWrapper variant="outlined">
        <ConnectorItem>
          <ImageComponent src={src} alt="connector" size={'64'} />
          <Typography variant="caption" textTransform={'uppercase'}>
            {displayName}
          </Typography>
          <CardFooter>
            <Chip
              label={'+10'}
              size="small"
              sx={{
                bgcolor: (theme) => theme.colors.secondary.main,
                color: 'white'
              }}
            />
          </CardFooter>
        </ConnectorItem>
        <Stack
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            opacity: 0,
            width: '100%',
            height: '100%',
            ':hover': {
              transition: 'all 0.3s',
              opacity: 1,
              borderRadius: 0,
              bgcolor: (theme) => theme.colors.alpha.black[50],
              color: (theme) => theme.colors.primary.main
            }
          }}
        >
          <IconButton color="primary" onClick={() => handleConnectorOnClick(item)}>
            <CustomIcon
              style={{
                fontSize: ImageSize.large,
                backgroundColor: 'white',
                borderRadius: '100%'
              }}
              icon={appIcons.CIRCLE_PLUS_OUTLINED}
            />
          </IconButton>
        </Stack>
      </CardWrapper>
    </Grid>
  );
};

export default ConnectorCard;
