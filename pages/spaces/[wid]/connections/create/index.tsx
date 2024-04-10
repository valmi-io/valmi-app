/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Paper } from '@mui/material';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import ConnectorConfig from '@content/ConnectionFlow/ConnectorConfig';
import AlertComponent from '@components/Alert';
import HorizontalLinearStepper, { Step } from '@components/Stepper';

import { AppDispatch } from '@store/store';
import { RootState } from '@store/reducers';

import constants from '@constants/index';

import { useSearchParams } from 'next/navigation';
import { getSearchParams } from '@/utils/router-utils';
import { isEmpty } from 'lodash';

type TConnectionUpsertParams = {
  type: string;
  wid: string;
  mode: 'etl' | 'retl';
  connectionId?: string;
};

export type TConnectionUpsertProps = {
  params: TConnectionUpsertParams;
};

import { Wizard, useWizard } from 'react-use-wizard';
import { setIds } from '@/store/reducers/connectionDataFlow';
import ConnectionSchedule from '@/content/ConnectionFlow/ConnectionSchedule';
import ConnectionDiscover from '@/content/ConnectionFlow/ConnectionDiscover';
import { OAuthContextProvider } from '@/contexts/OAuthContext';
import { getConnectionFlowSteps } from '@/utils/connectionFlowUtils';

const ConnectionsUpsertPageLayout = () => {
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  if (isEmpty(params)) return <></>;
  else return <ConnectionsUpsertPage params={params} />;
};

const ConnectionsUpsertPage = ({ params }: TConnectionUpsertProps) => {
  const { connectionId = '', mode = '' } = params ?? {};

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const isEditableFlow = !!connectionId;

  // states
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertDialog, showAlertDialog] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const connectionSteps = useMemo(() => {
    let isEditableFlow = false;
    const steps: Step[] = getConnectionFlowSteps(mode, isEditableFlow);

    let newIds = steps
      .filter((step) => {
        const idExists = connectionDataFlow.ids.includes(step.type ?? '');

        if (!idExists) {
          return step.type;
        }
      })
      .map((step) => step.type);

    let idsToStore = [...connectionDataFlow.ids, ...newIds];

    dispatch(setIds(idsToStore));

    return steps;
  }, [connectionId, mode]);

  // const onSubmit = (values: any) => {
  //   // check if this connector doesn't require oAuth
  //   if (!isConnectorRequiresOAuth(connector_spec)) {
  //     setConnectorConfigInConnectionFlow(dispatch, values, connection_flow);
  //     return;
  //   }

  //   // check if authorized
  //   if (hasAuthorizedOAuth(oauth_params, isEditableFlow)) {
  //     setConnectorConfigInConnectionFlow(dispatch, values, connection_flow);
  //   } else {
  //     // update oauth_error in connection flow state
  //     dispatch(
  //       setConnectionFlow({
  //         ...connection_flow.flowState,
  //         oauth_error: 'This connector requires authorization'
  //       })
  //     );
  //   }
  // };

  // const handleBack = () => {
  //   setCurrentStepInConnectionFlow(dispatch, currentStep - 1, connection_flow);
  // };

  // const handleNext = () => {
  //   // If it is the last step, create a new connection
  //   if (lastStep) {
  //     // Trigger api backend
  //     setCreatingConnection(true);

  //     // connection payload
  //     const payload = generateConnectionPayload(connection_flow.flowState, user);

  //     let connectionUrl = `/workspaces/${workspaceId}/credentials/create`;

  //     if (isEditableFlow) {
  //       connectionUrl = `/workspaces/${workspaceId}/credentials/update`;
  //     }

  //     setformStatus('submitting');

  //     connectionNetworkHandler(connectionUrl, payload);

  //     return;
  //   }
  //   // else, update current_step in connection_flow state.
  //   setCurrentStepInConnectionFlow(dispatch, currentStep + 1, connection_flow);
  // };

  const displayAlertDialog = (message: any, isError: boolean) => {
    showAlertDialog(true);
    setIsErrorAlert(isError);
    setAlertMessage(message);
  };

  const handleClose = () => {
    setAlertMessage('');
    showAlertDialog(false);
  };

  return (
    <OAuthContextProvider>
      <PageLayout
        pageHeadTitle={constants.connections.CREATE_CONNECTION_TITLE}
        title={isEditableFlow ? 'Edit connection' : 'Create a new connection'}
        displayButton={false}
      >
        <AlertComponent open={alertDialog} onClose={handleClose} message={alertMessage} isError={isErrorAlert} />
        {/** Stepper */}

        <Wizard
          startIndex={0}
          header={<HorizontalLinearStepper steps={connectionSteps} />}
          wrapper={<Paper variant="outlined" />}
        >
          <ConnectorConfig key={'connectorconfig'} params={params} />
          <ConnectionDiscover key={'connectionDiscover'} params={params} />
          <ConnectionSchedule key={'connectionSchedule'} params={params} />
        </Wizard>
      </PageLayout>
    </OAuthContextProvider>
  );
};

ConnectionsUpsertPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default ConnectionsUpsertPageLayout;
