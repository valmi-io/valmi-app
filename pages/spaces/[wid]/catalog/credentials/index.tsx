import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import ContentLayout from '@/layouts/ContentLayout';
import CredentialsTable from '@/content/Credentials/CredentialsTable';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useLazyFetchCredentialsQuery } from '@/store/api/apiSlice';
import { getBaseRoute } from '@/utils/lib';
import { useSearchParams } from 'next/navigation';
import { getSearchParams } from '@/utils/router-utils';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { TCredential } from '@/utils/typings.d';

const PageContent = ({ data }: { data: TCredential[] }) => {
  console.log('page content:_', data);
  if (data.length > 0) {
    // Display credentials when credentials data length > 0
    return <CredentialsTable credentials={data} />;
  }

  /** Display empty component */
  return <ListEmptyComponent description={'No credentials found for this catalog'} />;
};

const CredentialsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { workspaceId = '' } = useWorkspaceId();
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  const { type = '' } = params;

  const [
    fetchCredentials,
    { data: data, isError: isError, error: error, isLoading: isLoading, isFetching: isFetching }
  ] = useLazyFetchCredentialsQuery();

  const filteredData = (type: any) => {
    const arr = data?.resultData?.filter((item: any) => item?.display_name.toLowerCase() === type);
    return arr;
  };

  useEffect(() => {
    fetchCredentials({ workspaceId });
  }, [workspaceId, fetchCredentials]);

  const handleCreateConnectionOnClick = () => {
    router.push(`${getBaseRoute(workspaceId as string)}/connections/create`);
  };

  return (
    <PageLayout
      pageHeadTitle="Credentials"
      title="CREDENTIALS"
      buttonTitle="Credential"
      handleButtonOnClick={handleCreateConnectionOnClick}
    >
      <ContentLayout
        key={`credentialsPage`}
        error={isError}
        PageContent={<PageContent data={filteredData(type)} />}
        displayComponent={!error && !isFetching && data?.resultData}
        isLoading={isFetching}
        traceError={error}
      />
    </PageLayout>
  );
};

CredentialsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CredentialsPage;
