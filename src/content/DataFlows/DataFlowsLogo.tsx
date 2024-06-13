import { useWorkspaceId } from '@/hooks/useWorkspaceId';
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

const VALMI_LOGO = '/images/valmi_logo_no_text.svg';

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
          src={VALMI_LOGO}
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
