/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 4th 2023, 1:49:00 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactNode } from 'react';

import { Container, Paper } from '@mui/material';

import PageHead from '@components/PageHead';
import PageTitle from '@components/PageTitle';
import PageTitleWrapper from '@components/PageTitleWrapper';
import PageFooter from '@/components/PageFooter';

interface PageLayoutProps {
  pageHeadTitle: string;
  title: string;
  buttonTitleInHeader?: string;
  buttonTitleInFooter?: string;
  handleButtonInHeaderOnClick?: () => void;
  handleButtonInFooterOnClick?: () => void;
  displayButtonInHeader?: boolean;
  displayButtonInFooter?: boolean;
  children: ReactNode;
}

const PageLayout = (props: PageLayoutProps) => {
  const {
    pageHeadTitle,
    title,
    displayButtonInHeader,
    displayButtonInFooter,
    buttonTitleInHeader,
    buttonTitleInFooter,
    handleButtonInHeaderOnClick,
    handleButtonInFooterOnClick,
    children
  } = props;
  return (
    <Paper sx={{ height: '100%', paddingX: (theme) => theme.spacing(8) }}>
      <Paper sx={{ height: '100%', border: '1px solid black', paddingX: '16px' }}>
        <PageHead title={pageHeadTitle} />
        <PageTitleWrapper>
          <PageTitle
            title={title}
            displayButton={displayButtonInHeader}
            buttonTitle={buttonTitleInHeader?.toUpperCase()}
            onClick={handleButtonInHeaderOnClick}
          />
        </PageTitleWrapper>
        <Container maxWidth="lg">{children}</Container>
      </Paper>
      <Paper sx={{ paddingX: '16px' }}>
        <PageFooter
          displayFooterButton={displayButtonInFooter}
          displayStartIcon={false}
          footerButtonTitle={buttonTitleInFooter}
          onClick={handleButtonInFooterOnClick}
        />
      </Paper>
    </Paper>
  );
};

export default PageLayout;
