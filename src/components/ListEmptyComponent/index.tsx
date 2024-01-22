/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 24th 2023, 5:15:49 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, Button, Stack, Typography, styled } from '@mui/material';
import CustomIcon from '@components/Icon/CustomIcon';
import { faUnsplash } from '@fortawesome/free-brands-svg-icons';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

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
  buttonTitle?: string;
  buttonDisabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const ListEmptyComponent = (props: ListEmptyComponentProps) => {
  const { description = '', buttonTitle = '', buttonDisabled = false, onClick } = props;

  return (
    <BoxLayout>
      <Stack spacing={3} alignItems="center">
        <CustomIcon icon={faUnsplash} style={{ fontSize: 80 }} />
        <Typography sx={{ color: (theme) => theme.colors.alpha.black[50] }} variant="body1">
          {description}
        </Typography>
        {buttonTitle && (
          <Button
            startIcon={<AddTwoToneIcon fontSize="small" />}
            disabled={buttonDisabled}
            sx={{ mt: { xs: 2, md: 0 }, fontWeight: 'bold', fontSize: 14 }}
            variant="contained"
            onClick={onClick}
          >
            {buttonTitle.toUpperCase()}
          </Button>
        )}
      </Stack>
    </BoxLayout>
  );
};

export default ListEmptyComponent;
