import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { getValmiLogoSrc } from '@/utils/app-utils';
import { redirectToDataFlowsList } from '@/utils/router-utils';
import { Stack, Tooltip, styled } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

const LogoContainer = styled(Stack)(({}) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center'
}));

const DataFlowsLogo = () => {
  const router = useRouter();
  const { workspaceId = '' } = useWorkspaceId();

  const handleLogoOnClick = () => {
    redirectToDataFlowsList({ router, wid: workspaceId });
  };

  return (
    <LogoContainer>
      <Tooltip title="data flows">
        <Image
          id="logo"
          priority={true}
          src={getValmiLogoSrc()}
          alt="Logo"
          width={60}
          height={60}
          onClick={handleLogoOnClick}
          style={{ cursor: 'pointer' }}
        />
      </Tooltip>
    </LogoContainer>
  );
};

export default DataFlowsLogo;
