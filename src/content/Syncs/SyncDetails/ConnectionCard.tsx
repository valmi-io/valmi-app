/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, June 14th 2023, 9:54:31 pm
 * Author: Nagendra S @ valmi.io
 */

import { Paper, Typography } from '@mui/material';

import ImageComponent, { ImageSize } from '@components/ImageComponent';

const ConnectionCard = (props: any) => {
  const { connectionType, connectionTitle } = props;
  return (
    <Paper sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ImageComponent
        src={`/connectors/${connectionType.split('_')[1].toLowerCase()}.svg`}
        alt="connector"
        style={{ marginRight: 5 }}
        size={ImageSize.syncDetailsCard}
      />
      <Typography variant="body1">{connectionTitle.toLowerCase()}</Typography>
    </Paper>
  );
};

export default ConnectionCard;
