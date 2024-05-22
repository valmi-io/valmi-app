/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 4th 2023, 1:49:00 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactNode } from 'react';

import { Container, Grid, Paper, styled } from '@mui/material';

import PageHead from '@components/PageHead';
import PageTitle from '@components/PageTitle';
import PageTitleWrapper from '@components/PageTitleWrapper';

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

const PageLayout = (props: PageLayoutProps) => {
  const { pageHeadTitle, title, displayButton, buttonTitle, handleButtonOnClick, children } = props;
  return (
    <Paper sx={{ height: '100%', paddingX: (theme) => theme.spacing(8) }}>
      <Paper sx={{ height: '100%', border: '1px solid black', position: 'relative' }}>
        {/* <Grid
          container
          spacing={{ md: 2, xs: 2 }}
          sx={{ width: '100%', height: '100%', position: 'absolute', top: 10 }}
        >
          {Array.from(Array(12)).map((_, index) => (
            <Grid item xs={1} key={index} height="100%">
              <Item sx={{ height: '100%', bgcolor: 'transparent', border: '0.5px solid grey' }}>{index}</Item>
            </Grid>
          ))}
        </Grid> */}
        <PageHead title={pageHeadTitle} />
        <PageTitleWrapper>
          <PageTitle
            title={title}
            displayButton={displayButton}
            buttonTitle={buttonTitle?.toUpperCase()}
            onClick={handleButtonOnClick}
          />
        </PageTitleWrapper>
        <Container maxWidth="lg">{children}</Container>
      </Paper>
    </Paper>
  );
};

export default PageLayout;
