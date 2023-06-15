/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 16th 2023, 8:22:48 am
 * Author: Nagendra S @ valmi.io
 */

import { DialogTitle, IconButton, styled } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const Title = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(2)
}));

const DialogTitleComponent = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <Title {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </Title>
  );
};

export default DialogTitleComponent;
