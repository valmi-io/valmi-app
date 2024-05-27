import { ReactElement } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { useFetch } from '@/hooks/useFetch';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { isDataEmpty } from '@/utils/lib';
import ContentLayout from '@/layouts/ContentLayout';
import { useGetPromptsQuery } from '@/store/api/etlApiSlice';
import PromptsList from '@/content/Prompts/PromptsList';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { TData } from '@/utils/typings.d';

const PromptsPage: NextPageWithLayout = () => {
  const { workspaceId = '' } = useWorkspaceId();

  const { data, error, isLoading, traceError } = useFetch({
    query: useGetPromptsQuery({ workspaceId }, { refetchOnMountOrArgChange: true })
  });

  return (
    <PageLayout pageHeadTitle="Prompts" title="PRESET PROMPTS" displayButton={false}>
      <ContentLayout
        key={`prompts-page`}
        error={error}
        PageContent={<PageContent data={data} />}
        displayComponent={!!(!error && !isLoading && data)}
        isLoading={isLoading || !workspaceId}
        traceError={traceError}
      />
    </PageLayout>
  );
};

PromptsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default PromptsPage;

const PageContent = ({ data }: { data: TData }) => {
  if (isDataEmpty(data)) {
    return <ListEmptyComponent description={'No prompts found in this workspace'} />;
  }
  return <PromptsList data={data} />;
};
