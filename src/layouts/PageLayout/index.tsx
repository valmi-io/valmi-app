/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 4th 2023, 1:49:00 pm
 * Author: Nagendra S @ valmi.io
 */

import { Container } from '@mui/material';
import PageHead from '../../components/PageHead';
import PageTitle from '../../components/PageTitle';
import PageTitleWrapper from '../../components/PageTitleWrapper';
import { ReactNode } from 'react';

interface PageLayoutProps {
  pageHeadTitle: string;
  title: string;
  buttonTitle?: string;
  handleButtonOnClick?: () => void;
  displayButton?: boolean;
  children: ReactNode;
}

const PageLayout = (props: PageLayoutProps) => {
  const {
    pageHeadTitle,
    title,
    displayButton,
    buttonTitle,
    handleButtonOnClick,
    children
  } = props;
  return (
    <>
      <PageHead title={pageHeadTitle} />
      <PageTitleWrapper>
        <PageTitle
          title={title}
          displayButton={displayButton}
          buttonTitle={buttonTitle}
          onClick={handleButtonOnClick}
        />
      </PageTitleWrapper>
      <Container maxWidth="lg">{children}</Container>
    </>
  );
};

export default PageLayout;
