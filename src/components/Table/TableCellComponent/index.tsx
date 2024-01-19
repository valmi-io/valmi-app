/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 17th 2023, 8:53:28 pm
 * Author: Nagendra S @ valmi.io
 */

import { IconButton, TableCell, Tooltip, Typography } from '@mui/material';

import ImageComponent, { ImageComponentProps } from '@components/ImageComponent';
import CustomIcon from '@/components/Icon/CustomIcon';
import appIcons from '@/utils/icon-utils';

interface TableCellProps {
  text: string;
}

interface TableCellWithImageProps extends ImageComponentProps {}

interface TableCellWithActionButtonProps {
  tooltip: string;
  onClick: () => void;
  style?: React.CSSProperties;
  align?: 'center' | 'right' | 'left';
  actionType?: 'EDIT' | 'LIVE_EVENTS';
}

export const TableCellComponent = ({ text }: TableCellProps) => {
  return (
    <TableCell>
      <Typography variant="body2" color="text.primary" noWrap>
        {text}
      </Typography>
    </TableCell>
  );
};

export const TableCellWithImage = ({ size, src, alt, title }: TableCellWithImageProps) => {
  return (
    <TableCell>
      <ImageComponent size={size} src={src} alt={alt ? alt : 'icon'} style={{ marginRight: '10px' }} title={title} />
    </TableCell>
  );
};

export const TableCellWithActionButton = ({
  tooltip,
  onClick,
  style,
  align = 'center',
  actionType = 'EDIT'
}: TableCellWithActionButtonProps) => {
  return (
    <TableCell align={align} style={style}>
      <Tooltip title={tooltip}>
        <IconButton
          sx={{
            '&:hover': {
              background: (theme) => theme.colors.primary.lighter
            },
            color: (theme) => theme.palette.primary.main
          }}
          color="inherit"
          size="small"
          onClick={onClick}
        >
          <CustomIcon icon={appIcons[actionType]} />
          {/* <EditTwoToneIcon fontSize="small" /> */}
        </IconButton>
      </Tooltip>
    </TableCell>
  );
};
