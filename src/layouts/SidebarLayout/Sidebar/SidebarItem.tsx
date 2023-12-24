/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 12:37:46 pm
 * Author: Nagendra S @ valmi.io
 */

import { ListItemButton, Typography, styled, useTheme } from '@mui/material';
import FontAwesomeIcon from '@components/Icon/FontAwesomeIcon';

const Label = styled(Typography)(({ theme }) => ({
  color: theme.colors.alpha.white[70]
}));

const SidebarItem = ({ item, endpoint, onClick }: any) => {
  const theme = useTheme();
  return (
    <ListItemButton
      onClick={() => onClick(item.path)}
      className={
        endpoint === `${item.sidebarProps.displayText.toLowerCase()}`
          ? 'active'
          : ''
      }
    >
      {item.sidebarProps.icon && (
        <FontAwesomeIcon
          icon={item.sidebarProps.icon}
          style={{ marginRight: theme.spacing(3) }}
        />
      )}

      <Label variant="h5">{item.sidebarProps.displayText}</Label>
    </ListItemButton>
  );
};

export default SidebarItem;
