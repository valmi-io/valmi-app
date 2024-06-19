import { ReactElement } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import { useSearchParams } from 'next/navigation';

import SidebarLayout from '@layouts/SidebarLayout';
import { getSearchParams } from '@/utils/router-utils';
import { isEmpty } from 'lodash';
import { IParams, TData, TPrompt } from '@/utils/typings.d';
import PageLayout from '@/layouts/PageLayout';
import { Stack, Typography } from '@mui/material';
import { useFetch } from '@/hooks/useFetch';
import { useGetPromptByIdQuery } from '@/store/api/etlApiSlice';
import ContentLayout from '@/layouts/ContentLayout';
import { isDataEmpty } from '@/utils/lib';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import PromptDetails from '@/content/Prompts/PromptDetails';
import PreviewTable from '@/content/Prompts/PreviewTable';

export interface IPreviewPage extends IParams {
  pid: string;
  filter: string;
  query: string;
}

const PreviewPageLayout: NextPageWithLayout = () => {
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  if (isEmpty(params)) return <></>;
  else return <PreviewPage params={params} />;
};

const PreviewPage = ({ params }: { params: IPreviewPage }) => {
  const { pid = '', filter = '', wid = '' } = params;

  const { data, error, isLoading, traceError } = useFetch({
    query: useGetPromptByIdQuery({ promptId: pid, workspaceId: wid })
  });

  return (
    <PageLayout pageHeadTitle="Data Preview" title="DATA PREVIEW" displayButton={false}>
      <ContentLayout
        key={`prompt-preview-page`}
        error={error}
        PageContent={<PageContent data={data} params={params} />}
        displayComponent={!!(!error && !isLoading && data)}
        isLoading={isLoading}
        traceError={traceError}
      />
    </PageLayout>
  );
};

PreviewPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default PreviewPageLayout;

const PageContent = ({ data, params }: { data: TData; params: IPreviewPage }) => {
  const { ids, entities } = data;

  if (isDataEmpty(data)) {
    return <ListEmptyComponent description={'No data found for this prompt'} />;
  }

  return ids.map((id: string) => {
    const item: TPrompt = entities[id];

    return (
      <Stack key={id} spacing={2}>
        <PromptDetails item={item} />
        <PreviewTable params={params} prompt={item} />
      </Stack>
    );
  });
};
