import { ReactElement } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import { useSearchParams } from 'next/navigation';

import SidebarLayout from '@layouts/SidebarLayout';
import { getSearchParams } from '@/utils/router-utils';
import { isEmpty } from 'lodash';
import { IParams } from '@/utils/typings.d';
import PageLayout from '@/layouts/PageLayout';
import { Grid } from '@mui/material';
import PreviewDetails from '@/content/Prompts/PreviewDetails';
import PreviewTable from '@/content/Prompts/PreviewTable';

export interface IPreviewPage extends IParams {
  pid: string;
  filter: string;
}

const PreviewPageLayout: NextPageWithLayout = () => {
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  if (isEmpty(params)) return <></>;
  else return <PreviewPage params={params} />;
};

const PreviewPage = ({ params }: { params: IPreviewPage }) => {
  return (
    <PageLayout pageHeadTitle="Preview" title="Preview" displayButton={false}>
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <PreviewDetails params={params} />
        </Grid>
        <Grid item xs={12}>
          <PreviewTable params={params} />
        </Grid>
      </Grid>
    </PageLayout>
  );
};

PreviewPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default PreviewPageLayout;
