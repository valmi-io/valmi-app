import { ReactNode } from 'react';

import { Container, Grid, Paper, styled } from '@mui/material';

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

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center'
}));

const ContainerWrapper = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(0, 2),
  height: '100%'
}));

const InnerContainer = styled(Paper)(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  height: '100%',
  minWidth: '1024px',
  position: 'relative'
}));

const PageLayout = (props: PageLayoutProps) => {
  const { pageHeadTitle, title, displayButton, buttonTitle, handleButtonOnClick, children } = props;
  return (
    <ContainerWrapper maxWidth="lg">
      <InnerContainer variant="outlined">
        {/* <Grid
          container
          spacing={{ md: 2, xs: 2 }}
          sx={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        >
          {Array.from(Array(12)).map((_, index) => (
            <Grid item xs={1} key={index} height="100%">
              <Item sx={{ height: '100%', bgcolor: 'transparent', border: '0.5px solid grey' }}>{index}</Item>
            </Grid>
          ))}
        </Grid> */}
        <PageHead title={pageHeadTitle} />

        <PageTitle
          title={title}
          displayButton={displayButton}
          buttonTitle={buttonTitle?.toUpperCase()}
          onClick={handleButtonOnClick}
        />
        {children}
      </InnerContainer>
    </ContainerWrapper>
  );
};

export default PageLayout;
