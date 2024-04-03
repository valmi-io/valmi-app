/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { Paper, CardActions, Button, CircularProgress } from '@mui/material';

import { useForm } from 'react-hook-form';

import axios from 'axios';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { ConnectionSteps } from '@content/Connections/ConnectionModel';
import ConnectionTest from '@content/ConnectionFlow/ConnectionTest';
import Connectors from '@content/ConnectionFlow/Connectors';
import ConnectorConfig from '@content/ConnectionFlow/ConnectorConfig';
import {
  hasAuthorizedOAuth,
  isConnectorRequiresOAuth
} from '@content/ConnectionFlow/ConnectorConfig/ConnectorConfigUtils';

import { getErrorsInData, getErrorsInErrorObject, hasErrorsInData } from '@components/Error/ErrorUtils';
import AlertComponent from '@components/Alert';
import HorizontalLinearStepper from '@components/Stepper';

import { AppDispatch } from '@store/store';
import { RootState } from '@store/reducers';
import { setConnectionFlow } from '@store/reducers/connectionFlow';

import {
  enableBack,
  enableNext,
  generateConnectionPayload,
  setConnectorConfigInConnectionFlow,
  setCurrentStepInConnectionFlow
} from '@utils/connection-utils';

import constants from '@constants/index';
import { FormStatus } from '@/utils/form-utils';

import { useSearchParams } from 'next/navigation';
import { getSearchParams } from '@/utils/router-utils';
import { isEmpty } from 'lodash';

const CreateConnectionsPageLayout = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  if (isEmpty(params)) return <></>;
  else return <CreateConnectionsPage params={params} />;
};

const CreateConnectionsPage = ({ params }: { params: any }) => {
  const router = useRouter();

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {}
  });
  const [connectionSteps, setConnectionSteps] = useState(ConnectionSteps);

  // states
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertDialog, showAlertDialog] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);

  // form state - form can be in any of the states {FormStatus}
  const [formStatus, setformStatus] = useState<FormStatus>('empty');

  const [creatingConnection, setCreatingConnection] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  /** Redux store */
  const user = useSelector((state: RootState) => state.user.user);

  const connection_flow = useSelector((state: RootState) => state.connectionFlow);

  const {
    flowState: {
      selected_connector = null,
      connector_spec = null,
      connection_title = '',
      connector_config = null,
      isEditableFlow = false,
      oauth_params = {},
      currentStep = 0,
      lastStep = false
    } = {}
  } = connection_flow;

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '', currentRoute = '' } = appState;

  useEffect(() => {
    if (isEditableFlow) {
      // start connection step from step-2
      setConnectionSteps(ConnectionSteps.slice(1));
      // set connectorConfig
      reset((formValues) => ({
        ...formValues,
        ...connector_config,
        title: connection_title,
        connector_type: selected_connector.display_name
      }));
    }
  }, [router]);

  const handleFormStatus = (isFetching: boolean) => {
    setformStatus(isFetching ? 'submitting' : 'empty');
  };

  const getSectionComponent = () => {
    let step_components = [
      <ConnectorConfig key={'connectorconfig'} params={params} />,
      <ConnectionTest key={'connectiontest'} handleFormStatus={handleFormStatus} />
    ];
    if (isEditableFlow) {
      step_components = step_components.splice(1);
    }

    return <React.Fragment key={step_components[currentStep].key}>{step_components[currentStep]}</React.Fragment>;
  };

  const onSubmit = (values: any) => {
    // check if this connector doesn't require oAuth
    if (!isConnectorRequiresOAuth(connector_spec)) {
      setConnectorConfigInConnectionFlow(dispatch, values, connection_flow);
      return;
    }

    // check if authorized
    if (hasAuthorizedOAuth(oauth_params, isEditableFlow)) {
      setConnectorConfigInConnectionFlow(dispatch, values, connection_flow);
    } else {
      // update oauth_error in connection flow state
      dispatch(
        setConnectionFlow({
          ...connection_flow.flowState,
          oauth_error: 'This connector requires authorization'
        })
      );
    }
  };

  const handleBack = () => {
    setCurrentStepInConnectionFlow(dispatch, currentStep - 1, connection_flow);
  };

  const handleNext = () => {
    // If it is the last step, create a new connection
    if (lastStep) {
      // Trigger api backend
      setCreatingConnection(true);

      // connection payload
      const payload = generateConnectionPayload(connection_flow.flowState, user);

      let connectionUrl = `/workspaces/${workspaceId}/credentials/create`;

      if (isEditableFlow) {
        connectionUrl = `/workspaces/${workspaceId}/credentials/update`;
      }

      setformStatus('submitting');

      connectionNetworkHandler(connectionUrl, payload);

      return;
    }
    // else, update current_step in connection_flow state.
    setCurrentStepInConnectionFlow(dispatch, currentStep + 1, connection_flow);
  };

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

  const getConnectionButtonName = (isEditableFlow: boolean) => {
    if (isEditableFlow) return 'Update';
    return 'Create';
  };

  const handleClose = () => {
    setAlertMessage('');
    showAlertDialog(false);
  };

  const displaySubmitButton = (isFetching: boolean) => {
    let endIcon = null;
    endIcon = isFetching && <CircularProgress size={16} sx={{ color: 'white' }} />;

    return (
      <Button
        endIcon={endIcon}
        variant="contained"
        type={currentStep === (isEditableFlow ? 0 : 1) ? 'submit' : 'button'}
        onClick={currentStep === (isEditableFlow ? 0 : 1) ? handleSubmit(onSubmit) : handleNext}
        disabled={formStatus === 'submitting' || !enableNext(connection_flow)}
      >
        {currentStep === connectionSteps.length - 1 ? getConnectionButtonName(isEditableFlow) : 'Next'}
      </Button>
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
      <HorizontalLinearStepper activeStep={currentStep} steps={connectionSteps}>
        {/* Component returned based on active step */}
        <Paper variant="outlined">
          {getSectionComponent()}

          {/* Action buttons */}
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              color="inherit"
              variant="contained"
              disabled={formStatus === 'submitting' || !enableBack(connection_flow)}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            {displaySubmitButton(creatingConnection)}
          </CardActions>
        </Paper>
      </HorizontalLinearStepper>
    </PageLayout>
  );
};

CreateConnectionsPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateConnectionsPageLayout;
