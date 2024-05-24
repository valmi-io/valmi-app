/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 12:37:46 pm
 * Author: Nagendra S @ valmi.io
 */

import { memo } from "react";

import {
  Button,
  Container,
  Icon,
  ListItemButton,
  Stack,
  Typography,
  styled,
  Box,
  Paper,
  ListItem,
  ListItemText,
} from "@mui/material";
import CustomIcon from "@components/Icon/CustomIcon";
import { TSidebarRoute } from "@utils/sidebar-utils";

const Label = styled(Typography)(({ theme }) => ({
  color: theme.colors.alpha.white[70],
}));

const ItemContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: 'row',
  alignItems: "center",
  padding: theme.spacing(1, 2),
  width: theme.sidebar.width,
  height: 48,
}));

const IconContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "0px",
  minWidth: 56,
  height: 24,
  backgroundColor: 'transparent'
}));

const InnerIconBox = styled(Icon)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent:'center',
  paddingBottom: "3px",
  width: 24,
  height: 24,
  backgroundColor: 'transparent'
}));

const TextBox = styled(ListItemButton)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "4px 0px",
}));

export type TSidebarItemProps = {
  item: TSidebarRoute;
  currentRoute: any;
  onClick: (path: string) => void;
};

const SidebarItem = ({ item, currentRoute, onClick }: TSidebarItemProps) => {
  const {
    id = "",
    path = "",
    sidebarProps: { icon = null, displayText = "", muiIcon = false } = {},
  } = item;

  return (
    <ItemContainer>
      <IconContainer>
        <InnerIconBox>
          {icon && (muiIcon ? <Icon>{icon}</Icon> : <CustomIcon icon={icon} />)}
        </InnerIconBox>
      </IconContainer>

      <TextBox
        onClick={() => onClick(path)}
        className={currentRoute === id ? "active" : ""}
      >
        <Typography>{displayText}</Typography>
      </TextBox>
    </ItemContainer>
  );
};

export default memo(SidebarItem);
