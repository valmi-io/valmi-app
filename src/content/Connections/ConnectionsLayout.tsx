/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 26th 2023, 12:43:41 pm
 * Author: Nagendra S @ valmi.io
 */

import { Grid, Paper } from '@mui/material';
import PageLayout from '../../layouts/PageLayout';
import Connections from '.';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';
import { setConnectionFlow } from '../../store/reducers/connectionFlow';
import { useEffect } from 'react';
import { initialiseConnectionFlowState } from '../../utils/connection-utils';

type ConnectionLayoutProps = {
  pageHeadTitle: string;
  title: string;
  buttonTitle: string;
  connection_type: string;
};

const ConnectionLayout = (props: ConnectionLayoutProps) => {
  const { pageHeadTitle, title, buttonTitle, connection_type } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  // Redux store state.
  const appState = useSelector((state: RootState) => state.appFlow.appState);

  /** Redux store */
  const connection_flow = useSelector(
    (state: RootState) => state.connectionFlow
  );

  const { workspaceId = '' } = appState;

  useEffect(() => {
    // initialising connection_flow state.
    initialiseConnectionFlowState(dispatch, connection_flow, connection_type);
  }, []);

  const navigateToCreateConnectionsPage = () => {
    // update connection_type in connection_flow state.
    dispatch(
      setConnectionFlow({
        connection_type: connection_type,
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
      <Paper variant="outlined">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Connections connection_type={connection_type} />
          </Grid>
        </Grid>
      </Paper>
    </PageLayout>
  );
};

export default ConnectionLayout;
