/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Button,
  CardActions,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  styled
} from '@mui/material';

import SidebarLayout from '@/layouts/SidebarLayout';
import HorizontalLinearStepper from '@/components/Stepper';
import { AppDispatch } from '@/store/store';
import { RootState } from '@/store/reducers';
import { EditSyncFlowSteps, SyncFlowSteps } from '@/utils/sync-utils';
import Warehouse from '@/content/SyncFlow/Warehouse';
import Mapping from '@/content/SyncFlow/Mapping';
import Schedule from '@/content/SyncFlow/Schedule';
import {
  enableNext,
  initialiseFlowState,
  isLastStepInSyncFlow,
  isMappingStepInSyncFlow,
  setCurrentStepInFlow
} from '@/content/SyncFlow/stateManagement';
import {
  useLazyAddSyncQuery,
  useLazyUpdateSyncQuery
} from '@/store/api/apiSlice';
import { generateSyncPayload } from '@/content/Syncs/SyncsPage/SyncCreationUtils';
import PageLayout from '@/layouts/PageLayout';
import Instructions from '../../../../../src/components/Instructions';
import {
  getErrorsInData,
  getErrorsInErrorObject,
  hasErrorsInData
} from '../../../../../src/components/Error/ErrorUtils';
import AlertComponent from '../../../../../src/components/Alert';
import { isMappingStep } from '../../../../../src/content/SyncFlow/Mapping/mappingManagement';
import constants from '../../../../../src/constants';

const InstructionsLayout = styled(Box)(({ theme }) => ({
  width: '40%',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2)
}));

const SyncFlow = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  /** Redux store */
  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);

  const otherState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = otherState;

  const [createSyncQuery] = useLazyAddSyncQuery();

  const [updateSyncQuery] = useLazyUpdateSyncQuery();

  const { currentStep = 0, isEditableFlow = false } = flowState;

  const [initialised, setInitialised] = useState(false);

  // states
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertDialog, showAlertDialog] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);

  const [isFetchingQuery, setIsFetchingQuery] = useState<boolean>(false);

  const syncFlowSteps = isEditableFlow ? EditSyncFlowSteps : SyncFlowSteps;

  useEffect(() => {
    // initialising sync flow state
    initialiseFlowState(dispatch, flowState, isEditableFlow);
    setInitialised(true);
  }, []);

  const getSectionComponent = () => {
    let step_components = [
      <Warehouse key={'warehouse'} />,
      <Warehouse key={'destination'} />,
      <Mapping key={'mapping'} />,
      <Schedule key={'schedule'} />
    ];

    if (isEditableFlow) step_components = step_components.slice(2);
    let modified_step = currentStep;
    if (step_components.length > syncFlowSteps.length) modified_step += 1;
    return (
      <React.Fragment key={step_components[modified_step].key}>
        {step_components[modified_step]}
      </React.Fragment>
    );
  };

  const handleBack = () => {
    setCurrentStepInFlow(dispatch, currentStep - 1, flowState);
  };

  const handleNext = () => {
    if (currentStep === syncFlowSteps.length - 1) {
      setIsFetchingQuery(true);

      //create or update sync
      let syncQuery = createSyncQuery;
      if (isEditableFlow) {
        syncQuery = updateSyncQuery;
      }

      const syncPayload = generateSyncPayload(flowState, workspaceId);

      syncQueryHandler(syncQuery, syncPayload);
      return;
    }

    if (!isMappingStep(flowState)) {
      setCurrentStepInFlow(dispatch, currentStep + 1, flowState);
      return;
    }

    if (isMappingStepInSyncFlow(flowState)) {
      setCurrentStepInFlow(dispatch, currentStep + 1, flowState);
    }
    return;
  };

  const syncQueryHandler = async (syncQuery: any, payload: any) => {
    try {
      const data: any = await syncQuery(payload).unwrap();
      let isErrorAlert = false;
      if (hasErrorsInData(data)) {
        const traceError = getErrorsInData(data);
        isErrorAlert = true;
        displayAlertDialog(traceError, isErrorAlert);
        setIsFetchingQuery(false);
      } else {
        displayAlertDialog(
          `Sync ${isEditableFlow ? 'updated' : 'created'} successfully`,
          isErrorAlert
        );
        setIsFetchingQuery(false);
        router.push(`/spaces/${workspaceId}/syncs`);
      }
    } catch (error) {
      const errors = getErrorsInErrorObject(error);
      const { message = 'unknown' } = errors || {};
      const isErrorAlert = true;
      displayAlertDialog(message, isErrorAlert);
      setIsFetchingQuery(false);
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

  const displayInstructions = () => {
    const documentationUrl = constants.docs.syncs;
    const title = 'Sync Documentation';
    const linkText = 'sync';
    return (
      <Instructions
        documentationUrl={documentationUrl}
        title={title}
        linkText={linkText}
        type={'sync'}
      />
    );
  };

  const getButtonName = (flowState: any) => {
    if (isLastStepInSyncFlow(flowState) && enableNext(flowState)) {
      return isEditableFlow ? 'Update' : 'Create';
    }
    return 'Next';
  };

  const displaySubmitButton = (isFetching: boolean) => {
    let endIcon = null;
    endIcon = isLastStepInSyncFlow(flowState) && isFetching && (
      <CircularProgress size={16} sx={{ color: 'white' }} />
    );

    return (
      <Button
        endIcon={endIcon}
        variant="contained"
        onClick={handleNext}
        disabled={!enableNext(flowState)}
      >
        {getButtonName(flowState)}
      </Button>
    );
  };

  return (
    <PageLayout
      pageHeadTitle={'Create sync'}
      title={flowState.length ? 'Edit sync' : 'Create a new sync'}
      displayButton={false}
    >
      <AlertComponent
        open={alertDialog}
        onClose={handleClose}
        message={alertMessage}
        isError={isErrorAlert}
      />
      {/** Stepper */}
      <HorizontalLinearStepper activeStep={currentStep} steps={syncFlowSteps}>
        {/* Component returned based on active step */}
        <Paper variant="outlined">
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Box sx={{ width: '100%' }}>
              {initialised && getSectionComponent()}
            </Box>

            <InstructionsLayout>{displayInstructions()}</InstructionsLayout>
          </Stack>
          {/* Action buttons*/}
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              color="inherit"
              variant="contained"
              disabled={currentStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>

            {displaySubmitButton(isFetchingQuery)}
          </CardActions>
        </Paper>
      </HorizontalLinearStepper>
    </PageLayout>
  );
};

SyncFlow.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SyncFlow;
