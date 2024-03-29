/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 26th 2023, 12:43:41 pm
 * Author: Nagendra S @ valmi.io
 */

import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { Paper } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import PageLayout from '@layouts/PageLayout';

import { useFilteredConnectionsData } from '@content/Connections/useFilteredConnectionsData';
import ConnectionsTable from '@content/Connections/ConnectionsTable';

import ListEmptyComponent from '@components/ListEmptyComponent';

import { RootState } from '@store/reducers';
import { setConnectionFlow } from '@store/reducers/connectionFlow';

import { initialiseConnectionFlowState } from '@utils/connection-utils';
import ContentLayout from '@/layouts/ContentLayout';

type ConnectionLayoutProps = {
  pageHeadTitle: string;
  title: string;
  buttonTitle: string;
  connectionType: string;
};

const Connections = (props: ConnectionLayoutProps) => {
  const { pageHeadTitle, title, buttonTitle, connectionType } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  // Redux store state.
  const appState = useSelector((state: RootState) => state.appFlow.appState);

  /** Redux store */
  const connection_flow = useSelector((state: RootState) => state.connectionFlow);

  const { workspaceId = '' } = appState;

  const { connectionsError, filteredConnectionsData, isFetching, traceError } = useFilteredConnectionsData(
    workspaceId,
    connectionType
  );

  useEffect(() => {
    // initialising connection_flow state.
    initialiseConnectionFlowState(dispatch, connection_flow, connectionType);
  }, []);

  const PageContent = () => {
    if (filteredConnectionsData.length > 0) {
      // Display connections when connections data length > 0
      return <ConnectionsTable connections={filteredConnectionsData} connectionType={connectionType} />;
    }

    {
      /** Display empty component */
    }
    return <ListEmptyComponent description={'No connections found in this workspace'} />;
  };

  const navigateToCreateConnectionsPage = () => {
    // update connection_type in connection_flow state.
    dispatch(
      setConnectionFlow({
        connection_type: connectionType,
        currentStep: 0,
        steps: [],
        isEditableFlow: false
      })
    );

    router.push(`/spaces/${workspaceId}/connections/create`);
  };

  return (
    <PageLayout
      pageHeadTitle={pageHeadTitle}
      title={title}
      buttonTitle={buttonTitle}
      handleButtonOnClick={navigateToCreateConnectionsPage}
    >
      <Paper>
        <ContentLayout
          key={`connectionsPage-${connectionType}`}
          error={connectionsError}
          PageContent={<PageContent />}
          displayComponent={!connectionsError && !isFetching && filteredConnectionsData}
          isLoading={isFetching}
          traceError={traceError}
        />
      </Paper>
    </PageLayout>
  );
};

export default Connections;
