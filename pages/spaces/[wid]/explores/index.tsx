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
import ExploresList from '@/content/Explores/ExploresList';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { TData } from '@/utils/typings.d';

const ExploresPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { workspaceId = '' } = useWorkspaceId();

  const { data, error, isLoading, traceError } = useFetch({
    query: useGetExploresQuery({ workspaceId }, { refetchOnMountOrArgChange: true, skip: !workspaceId })
  });
  const handleButtonOnClick = () => {
    router.push(`${getBaseRoute(workspaceId!)}/prompts`);
  };

  return (
    <PageLayout
      pageHeadTitle="Explores"
      title="EXPLORES"
      buttonTitle={'Explore'}
      handleButtonOnClick={handleButtonOnClick}
    >
      <ContentLayout
        key={`explores-page`}
        error={error}
        PageContent={<PageContent data={data} />}
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

const PageContent = ({ data }: { data: TData }) => {
  if (isDataEmpty(data)) {
    return <ListEmptyComponent description={'No explores found in this workspace'} />;
  }

  return <ExploresList data={data} />;
};
