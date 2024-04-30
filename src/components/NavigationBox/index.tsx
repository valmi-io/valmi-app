import React from 'react';
import { InputLabel, styled, Stack, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

type NavigationBox = {
  label: string;
  redirectRoute: string;
};

const Label = styled(InputLabel)(({ theme }) => ({
  ...theme.typography.body1
}));

const NavigationBox = ({ label, redirectRoute }: NavigationBox) => {
  const router = useRouter();

  const { workspaceId = null } = useWorkspaceId();
  const handleClick = () => {
    router.push(`/spaces/${workspaceId}/${redirectRoute}`);
  };
  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        border: 1,
        p: 2,
        width: 'fit-content',
        borderRadius: 1
      }}
    >
      <Button type="submit" onClick={handleClick} style={{ textDecoration: 'none' }}>
        <Label>{label}</Label>
      </Button>
      &#x2197;
    </Stack>
  );
};

export default NavigationBox;
