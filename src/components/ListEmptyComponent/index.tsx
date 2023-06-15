/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 24th 2023, 5:15:49 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, Stack, Typography, styled } from '@mui/material';
import FontAwesomeIcon from '../Icon/FontAwesomeIcon';

const BoxLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(5)
}));

type ListEmptyComponentProps = {
  description?: string;
};

const ListEmptyComponent = (props: ListEmptyComponentProps) => {
  const { description } = props;

  return (
    <BoxLayout>
      <Stack spacing={3} alignItems="center">
        <FontAwesomeIcon
          className="fa-brands fa-unsplash"
          style={{ fontSize: 80 }}
        />
        <Typography
          sx={{ color: (theme) => theme.colors.alpha.black[50] }}
          variant="body1"
        >
          {description}
        </Typography>
      </Stack>
    </BoxLayout>
  );
};

export default ListEmptyComponent;
