/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, June 14th 2023, 9:54:31 pm
 * Author: Nagendra S @ valmi.io
 */

import { Chip, Paper, Stack, Typography, styled } from '@mui/material';

import ImageComponent, { ImageSize } from '@components/ImageComponent';

import { capitalizeFirstLetter } from '@utils/lib';

const ConnectorChip = styled(Chip)(({ theme }) => ({
  color: theme.colors.alpha.white[100],
  borderRadius: 4,
  backgroundColor: '#B497FF'
}));

const ConnectionCard = (props: any) => {
  const { connectionType, connectionTitle } = props;
  return (
    <Paper variant="outlined">
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ padding: (theme) => theme.spacing(1) }}>
          <ImageComponent
            src={`/connectors/${connectionType.split('_')[1].toLowerCase()}.svg`}
            alt="connector"
            style={{ marginRight: 10 }}
            size={ImageSize.large}
          />

          <Stack spacing={0.5}>
            <ConnectorChip size="small" label={capitalizeFirstLetter(connectionType.split('_')[1])} />
            <Typography variant="body2">{connectionTitle}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ConnectionCard;
