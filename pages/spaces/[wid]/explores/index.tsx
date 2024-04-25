//@S-Nagendra
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
import { useGetExploresQuery } from '@/store/api/etlApiSlice';
import { useFetch } from '@/hooks/useFetch';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import Explores from '@/content/Explores';

const ExploresPage: NextPageWithLayout = () => {
  const router = useRouter();

  const appState: AppState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

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
