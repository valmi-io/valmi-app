/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Saturday, January 20th 2024, 8:25:22 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, CircularProgress, Paper, Typography, styled } from '@mui/material';
import { memo } from 'react';

export const TableFooterLayout = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const EventsFooter = ({ isFetching }: { isFetching: boolean }) => {
  return (
    <TableFooterLayout>
      <Paper variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        {isFetching && <CircularProgress size={14} />}
        <Typography variant="subtitle1" sx={{ opacity: isFetching ? 1 : 0.5 }}>
          {isFetching ? 'Loading previous events' : 'Load previous events'}
        </Typography>
      </Paper>
    </TableFooterLayout>
  );
};

export default memo(EventsFooter);
