import { ReactElement } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import { useSearchParams } from 'next/navigation';

import SidebarLayout from '@layouts/SidebarLayout';
import DataTable from '@/components/DataTable';
import { useFetch } from '@/hooks/useFetch';
import { useGetPreviewDataQuery } from '@/store/api/etlApiSlice';
import { getSearchParams } from '@/utils/router-utils';
import { isEmpty } from 'lodash';
import { IParams } from '@/utils/typings.d';
import PageLayout from '@/layouts/PageLayout';
import ContentLayout from '@/layouts/ContentLayout';
import { isDataEmpty } from '@/utils/lib';
import ListEmptyComponent from '@/components/ListEmptyComponent';

interface IPreviewPage extends IParams {
  pid: string;
}

const PreviewPageLayout: NextPageWithLayout = () => {
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  if (isEmpty(params)) return <></>;
  else return <PreviewPage params={params} />;
};

const PreviewPage = ({ params }: { params: IPreviewPage }) => {
  const { pid = '', wid = '' } = params;

  const { data, isFetching, traceError, error } = useFetch({
    query: useGetPreviewDataQuery({
      workspaceId: wid,
      promptId: pid
    })
  });

  const PageContent = () => {
    if (isDataEmpty(data)) {
      return <ListEmptyComponent description={'No data found for this prompt'} />;
    }

    return <DataTable data={data} />;
  };

  return (
    <PageLayout pageHeadTitle="Preview" title="Preview" displayButton={false}>
      <ContentLayout
        key={`PreviewPage`}
        error={error}
        PageContent={<PageContent />}
        displayComponent={!error && !traceError && !isFetching && data}
        isLoading={isFetching}
        traceError={traceError}
      />
    </PageLayout>
  );
};

PreviewPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default PreviewPageLayout;
