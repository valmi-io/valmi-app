/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 5th 2023, 1:23:07 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, InputLabel, styled } from '@mui/material';

const Label = styled(InputLabel)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}));

type MappingCardProps = {
  label: string;
  icon: any;
  children?: React.ReactNode;
};

const MappingCard = (props: MappingCardProps) => {
  const { children, label, icon } = props;
  return (
    <>
      <Box display="flex">
        {icon}
        <Label>{label}</Label>
      </Box>
      {children}
    </>
  );
};

export default MappingCard;
