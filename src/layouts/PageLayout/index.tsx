import { ReactNode } from 'react';

import { Paper, styled } from '@mui/material';

import PageHead from '@components/PageHead';
import PageTitle from '@components/PageTitle';

interface PageLayoutProps {
  pageHeadTitle: string;
  title: string;
  buttonTitle?: string;
  handleButtonOnClick?: () => void;
  displayButton?: boolean;
  children: ReactNode;
}

const LayoutRoot = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2)
}));

const ContentWrapper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(1)
}));

const PageLayout = (props: PageLayoutProps) => {
  const { pageHeadTitle, title, displayButton, buttonTitle, handleButtonOnClick, children } = props;

  return (
    <LayoutRoot variant="outlined">
      <PageHead title={pageHeadTitle} />

      <PageTitle
        title={title}
        displayButton={displayButton}
        buttonTitle={buttonTitle?.toUpperCase()}
        onClick={handleButtonOnClick}
      />
      <ContentWrapper>{children}</ContentWrapper>
    </LayoutRoot>
  );
};

export default PageLayout;
