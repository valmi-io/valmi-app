//@S-Nagendra
import { ReactElement } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import { useSearchParams } from 'next/navigation';

import SidebarLayout from '@layouts/SidebarLayout';
import { getSearchParams } from '@/utils/router-utils';
import { isEmpty } from 'lodash';
import { IParams, TData } from '@/utils/typings.d';
import PageLayout from '@/layouts/PageLayout';
import { Box, Card, Grid, Stack } from '@mui/material';
import { useFetch } from '@/hooks/useFetch';
import { useGetExploreByIdQuery } from '@/store/api/etlApiSlice';
import ErrorComponent, { ErrorStatusText } from '@/components/Error';
import SkeletonLoader from '@/components/SkeletonLoader';
import { isDataEmpty } from '@/utils/lib';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import BaseLayout from '@/layouts/BaseLayout';
import PageTitle from '@/components/PageTitle';

import Breadcrumb from '@components/Breadcrumb';

const PreviewPageLayout: NextPageWithLayout = () => {
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  if (isEmpty(params)) return <></>;
  else return <PreviewPage params={params} />;
};

const PreviewPage = ({ params }: { params: IParams }) => {
  const { wid = '', eid = '' } = params;

  const { data, error, isLoading, traceError } = useFetch({
    query: useGetExploreByIdQuery({ workspaceId: wid, exploreId: eid })
  });

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', p: 2 }}>
        <Breadcrumb />
      </Box>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/** Display Errors */}
        {error && <ErrorComponent error={error} />}

        {/** Display Trace Error */}
        {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

        <SkeletonLoader loading={isLoading} />

        {!error && !isLoading && data && <PageContent data={data} />}
      </Box>
    </Stack>
  );
};

PreviewPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default PreviewPageLayout;

const PageContent = ({ data }: { data: TData }) => {
  const { ids, entities } = data;
  if (isDataEmpty(data)) {
    return <ListEmptyComponent description={'No data found for this prompt'} />;
  }

  const spreadsheet = entities[ids[0]].spreadsheet_url;

  return <iframe src={spreadsheet ?? ''} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>;
};
