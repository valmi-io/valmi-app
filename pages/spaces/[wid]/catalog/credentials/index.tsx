import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import ContentLayout from '@/layouts/ContentLayout';
import CredentialsTable from '@/content/Credentials/CredentialsTable';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useSearchParams } from 'next/navigation';
import { getSearchParams, redirectToCreateConnection } from '@/utils/router-utils';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { TCredential } from '@/utils/typings.d';
import { useCredentials } from '@/content/Credentials/useCredentials';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setConnectionFlowState } from '@/store/reducers/connectionDataFlow';
import { getSelectedConnectorKey } from '@/utils/connectionFlowUtils';
import { RootState } from '@/store/reducers';

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

  /** Redux store */
  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const { filteredCredentials, error, isFetching, isError } = useCredentials({
    workspaceId: workspaceId,
    integrationType: type
  });

  useEffect(() => {
    const selectedConnectorKey = getSelectedConnectorKey();

    console.log('Connection data flow:_', connectionDataFlow);
    const updatedConnectionDataFlow = {
      ids: [selectedConnectorKey],
      entities: {
        [selectedConnectorKey]: {
          ...connectionDataFlow.entities[selectedConnectorKey],
          oauth_params: {},
          oauth_error: ''
        }
      }
    };

    dispatch(setConnectionFlowState(updatedConnectionDataFlow));
  }, []);

  const handleCreateConnectionOnClick = () => {
    redirectToCreateConnection({ router, wid: workspaceId });
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
