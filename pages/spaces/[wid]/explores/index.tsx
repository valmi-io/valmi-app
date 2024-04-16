import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { RootState } from '@store/reducers';
import { getBaseRoute, isDataEmpty } from '@/utils/lib';
import ContentLayout from '@/layouts/ContentLayout';
import { AppState } from '@/store/store';
import { Chip, Grid, IconButton, Paper, Stack, Typography, darken, styled } from '@mui/material';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import CustomIcon from '@/components/Icon/CustomIcon';
import appIcons from '@/utils/icon-utils';

const data = [
  {
    spreadsheet_url: '',
    account: {
      name: 'valmiio-user'
    },
    ready: false,
    prompt_id: '',
    workspace_id: '',
    name: 'valmi.io - Sales performance by first-visit UTMS',
    id: '123'
  }
];

const Card = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  cursor: 'pointer',
  padding: theme.spacing(2),
  borderRadius: 5
}));

const Filter = styled(Chip)(({ theme }) => ({
  color: theme.colors.alpha.white[100],
  borderRadius: 4,
  backgroundColor: '#B497FF'
}));

const ExploresPage: NextPageWithLayout = () => {
  const router = useRouter();
  const appState: AppState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const { isLoading, traceError, error } = {
    isLoading: false,
    traceError: false,
    error: null
  };

  const handleButtonOnClick = () => {
    router.push(`${getBaseRoute(workspaceId)}/prompts`);
  };

  const PageContent = () => {
    return (
      <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {data.map((item) => {
          const src = `/connectors/google-sheets.svg`;
          return (
            <Grid item xs={'auto'} sm={4} md={4}>
              <Paper sx={{ borderRadius: 1 }} variant="outlined">
                <Card
                  sx={{
                    backgroundColor: (theme) => darken(theme.colors.alpha.white[5], 1)
                  }}
                >
                  <Stack
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <ImageComponent src={src} alt="connector" size={ImageSize.medium} />

                    <IconButton sx={{ ml: 2 }} color="primary" onClick={() => {}}>
                      <CustomIcon style={{ fontSize: ImageSize.medium }} icon={appIcons.CIRCLE_PLUS_OUTLINED} />
                    </IconButton>
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="body1" color="text.primary">
                      {item.name}
                    </Typography>
                  </Stack>

                  <Stack sx={{ display: 'flex', flexDirection: 'row', pt: 2, flexWrap: 'wrap' }} gap={1}></Stack>
                </Card>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <PageLayout
      pageHeadTitle="Explores"
      title="Explores"
      buttonTitle={'Explore'}
      handleButtonOnClick={handleButtonOnClick}
    >
      <ContentLayout
        key={`explorespage`}
        error={error}
        PageContent={<PageContent />}
        displayComponent={!!(!error && !isLoading && data)}
        isLoading={isLoading}
        traceError={traceError}
      />
    </PageLayout>
  );
};

ExploresPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default ExploresPage;
