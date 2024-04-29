/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { Paper, CardActions, Button, CircularProgress } from '@mui/material';

import axios from 'axios';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { EtlConnectionSteps, RetlConnectionSteps } from '@content/Connections/ConnectionModel';
import ConnectorConfig from '@content/ConnectionFlow/ConnectorConfig';
import { getErrorsInData, getErrorsInErrorObject, hasErrorsInData } from '@components/Error/ErrorUtils';
import AlertComponent from '@components/Alert';
import HorizontalLinearStepper from '@components/Stepper';

import { AppDispatch } from '@store/store';
import { RootState } from '@store/reducers';

import constants from '@constants/index';
import { FormStatus } from '@/utils/form-utils';

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
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const Step2 = () => {
  return (
    <>
      <p>Step 2 - Display list of streams</p>
    </>
  );
};

const Step3 = () => {
  return (
    <>
      <ConnectionSchedule />
    </>
  );
};

const ConnectionsUpsertPageLayout = () => {
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  if (isEmpty(params)) return <></>;
  else return <ConnectionsUpsertPage params={params} />;
};

const ConnectionsUpsertPage = ({ params }: TConnectionUpsertProps) => {
  const { connectionId = '', mode = '' } = params ?? {};

  const isEditableFlow = !!connectionId;

  const router = useRouter();

  // states
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertDialog, showAlertDialog] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);

  // form state - form can be in any of the states {FormStatus}
  const [formStatus, setformStatus] = useState<FormStatus>('empty');

  const [creatingConnection, setCreatingConnection] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { currentRoute = '' } = appState;

  const { workspaceId = null } = useWorkspaceId();

  const connectionSteps = useMemo(() => {
    let steps: any[] = [];
    let stepsToSlice = 0; // number of steps to skip,when connection is editable
    const isEditableFlow = !!connectionId; // checking if connection is editable.

    if (mode === 'etl') {
      steps = [...steps, ...EtlConnectionSteps];
      stepsToSlice = 1;
    }
    if (mode === 'retl') {
      steps = [...steps, ...RetlConnectionSteps];
      stepsToSlice = 2;
    }

    if (isEditableFlow) {
      steps.slice(stepsToSlice);
    }

    let arr = Array.from({ length: steps.length }, (x, i) => i.toString());
    // dispatching number of steps in redux store.
    dispatch(setIds(arr));

    return steps;
  }, [connectionId, mode]);

  const handleFormStatus = (isFetching: boolean) => {
    setformStatus(isFetching ? 'submitting' : 'empty');
  };

  // const getSectionComponent = () => {
  //   let step_components = [
  //     <ConnectorConfig key={'connectorconfig'} params={params} />,
  //     <ConnectorConfig key={'connectorconfig'} params={params} />,
  //     <ConnectionTest key={'connectiontest'} handleFormStatus={handleFormStatus} />
  //   ];
  //   if (isEditableFlow) {
  //     step_components = step_components.splice(1);
  //   }

  //   console.log('Step components:_', step_components);

  //   return <React.Fragment key={step_components[currentStep].key}>{step_components[currentStep]}</React.Fragment>;
  // };

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

  const connectionNetworkHandler = async (connectionUrl: string, data: any) => {
    try {
      const response = await axios.post('/api/connectionNetworkHandler', {
        connectionUrl,
        data
      });
      const result = response.data;
      let isErrorAlert = false;
      if (hasErrorsInData(result)) {
        const traceError = getErrorsInData(data);
        isErrorAlert = true;
        displayAlertDialog(traceError, isErrorAlert);
      } else {
        displayAlertDialog(`Connection ${isEditableFlow ? 'updated' : 'created'} successfully`, isErrorAlert);
        router.push(`/spaces/${workspaceId}/connections/${currentRoute}`);
      }
      setCreatingConnection(false);
    } catch (error: any) {
      // Handle any errors that occur during the API request
      const errors = getErrorsInErrorObject(error.response);
      const { message = 'unknown' } = errors || {};
      const isErrorAlert = true;
      displayAlertDialog(message, isErrorAlert);
      setCreatingConnection(false);
    } finally {
      setformStatus('empty');
    }
  };

  const displayAlertDialog = (message: any, isError: boolean) => {
    showAlertDialog(true);
    setIsErrorAlert(isError);
    setAlertMessage(message);
  };

  const handleClose = () => {
    setAlertMessage('');
    showAlertDialog(false);
  };

  const Footer = () => {
    const { isFirstStep, isLastStep, nextStep, previousStep } = useWizard();

    if (isFirstStep) return null;

    return (
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <Button color="inherit" variant="contained" onClick={() => previousStep()} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button color="inherit" variant="contained" onClick={() => nextStep()} sx={{ mr: 1 }}>
          Next
        </Button>
      </CardActions>
    );
  };

  return (
    <PageLayout
      pageHeadTitle={constants.connections.CREATE_CONNECTION_TITLE}
      title={isEditableFlow ? 'Edit connection' : 'Create a new connection'}
      displayButton={false}
    >
      <AlertComponent open={alertDialog} onClose={handleClose} message={alertMessage} isError={isErrorAlert} />
      {/** Stepper */}

      <Wizard
        startIndex={0}
        footer={<Footer />}
        header={<HorizontalLinearStepper steps={connectionSteps} />}
        wrapper={<Paper variant="outlined" />}
      >
        <ConnectorConfig key={'connectorconfig'} params={params} />
        <Step2 />
        <Step3 />
      </Wizard>
    </PageLayout>
  );
};

ConnectionsUpsertPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default ConnectionsUpsertPageLayout;
