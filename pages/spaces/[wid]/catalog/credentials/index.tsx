import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import ContentLayout from '@/layouts/ContentLayout';
import CredentialsTable from '@/content/Credentials/CredentialsTable';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { getBaseRoute } from '@/utils/lib';
import { useSearchParams } from 'next/navigation';
import { getSearchParams } from '@/utils/router-utils';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { TCredential } from '@/utils/typings.d';
import { useCredentials } from '@/content/Credentials/useCredentials';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { clearConnectionFlowState } from '@/store/reducers/connectionDataFlow';
import { getSelectedConnectorKey } from '@/utils/connectionFlowUtils';

const PageContent = ({ data }: { data: TCredential[] }) => {
  if (data.length > 0) {
    // Display credentials when credentials data length > 0
    return <CredentialsTable credentials={data} />;
  }

  /** Display empty component */
  return <ListEmptyComponent description={'No credentials found for this catalog'} />;
};

const CredentialsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { workspaceId = '' } = useWorkspaceId();
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  const { type = '' } = params;

  const { filteredCredentials, error, isFetching, isError } = useCredentials({
    workspaceId: workspaceId,
    integrationType: type
  });

  useEffect(() => {
    // dispatch(clearConnectionFlowState());
    // const type = catalog?.display_name.toLowerCase();
    // const key = getSelectedConnectorKey();
    // const objToDispatch = {
    //   ids: [key],
    //   entities: {
    //     [key]: {  } // initially setting oauth_params, oauth_error to empty in store
    //   }
    // };
    // dispatch(setConnectionFlowState(objToDispatch));
    // if (hasConnections(catalog)) {
    //   redirectToCredentials({ router, wid: workspaceId, type: type });
    // } else {
    //   redirectToCreateConnection({ router, wid: workspaceId });
    // }
  }, []);

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
        PageContent={<PageContent data={filteredCredentials} />}
        displayComponent={!error && !isFetching && filteredCredentials}
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
