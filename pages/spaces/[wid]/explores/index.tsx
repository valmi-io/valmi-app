//@S-Nagendra
import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { getBaseRoute, isDataEmpty } from '@/utils/lib';
import ContentLayout from '@/layouts/ContentLayout';
import { useGetExploresQuery } from '@/store/api/etlApiSlice';
import { useFetch } from '@/hooks/useFetch';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import Explores from '@/content/Explores';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const ExploresPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { workspaceId = null } = useWorkspaceId();

  const { data, error, isLoading, traceError } = useFetch({
    query: useGetExploresQuery({ workspaceId }, { refetchOnMountOrArgChange: true })
  });

  const handleButtonOnClick = () => {
    router.push(`${getBaseRoute(workspaceId)}/prompts`);
  };

  const PageContent = () => {
    if (isDataEmpty(data)) {
      return <ListEmptyComponent description={'No explores found in this workspace'} />;
    }

    return <Explores data={data} />;
  };

  return (
    <PageLayout
      pageHeadTitle="Explores"
      title="Explores"
      buttonTitle={'Explore'}
      handleButtonOnClick={handleButtonOnClick}
    >
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

ExploresPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default ExploresPage;
