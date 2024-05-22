import { ReactElement } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { useFetch } from '@/hooks/useFetch';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { isDataEmpty } from '@/utils/lib';
import ContentLayout from '@/layouts/ContentLayout';
import { useGetPromptsQuery } from '@/store/api/etlApiSlice';
import Prompts from '@/content/Prompts';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const PromptsPage: NextPageWithLayout = () => {
  const { workspaceId = '' } = useWorkspaceId();

  const { data, error, isLoading, traceError } = useFetch({
    query: useGetPromptsQuery({ workspaceId }, { refetchOnMountOrArgChange: true })
  });

  console.log('data:', data);

  const PageContent = () => {
    if (isDataEmpty(data)) {
      return <ListEmptyComponent description={'No prompts found in this workspace'} />;
    }
    return <Prompts data={data} />;
  };

  return (
    <PageLayout pageHeadTitle="Prompts" title="Prompts" displayButton={false}>
      <ContentLayout
        key={`prompts-page`}
        error={error}
        PageContent={<PageContent />}
        displayComponent={!!(!error && !isLoading && data)}
        isLoading={isLoading}
        traceError={traceError}
      />
    </PageLayout>
  );
};

PromptsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default PromptsPage;
