import AlertComponent from '@/components/Alert';
import HorizontalLinearStepper, { Step } from '@/components/Stepper';
import constants from '@/constants';
import ConnectionDiscover from '@/content/ConnectionFlow/ConnectionDiscover';
import ConnectionSchedule from '@/content/ConnectionFlow/ConnectionSchedule';
import ConnectorConfig from '@/content/ConnectionFlow/ConnectorConfig';
import { OAuthContextProvider } from '@/contexts/OAuthContext';
import PageLayout from '@/layouts/PageLayout';
import { RootState } from '@/store/reducers';
import { setIds } from '@/store/reducers/connectionDataFlow';
import { AppDispatch } from '@/store/store';
import { getConnectionFlowSteps } from '@/utils/connectionFlowUtils';
import { Paper } from '@mui/material';
import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wizard } from 'react-use-wizard';

const ConnectionFormComponent = ({ params }: { params: any }) => {
  const { cid = '', mode = '' } = params ?? {};

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const isEditableFlow = !!cid;

  // states
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertDialog, showAlertDialog] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const connectionSteps = useMemo(() => {
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

    if (!isEditableFlow) {
      dispatch(setIds(idsToStore));
    }

    return steps;
  }, [cid, mode]);

  const handleClose = () => {
    setAlertMessage('');
    showAlertDialog(false);
  };

  const getWizardStepContent = () => {
    if (isEditableFlow) {
      return [
        <ConnectionDiscover key="connectiondiscover" params={params} isEditableFlow={isEditableFlow} />,
        <ConnectionSchedule key="connectionschedule" params={params} isEditableFlow={isEditableFlow} />
      ];
    } else {
      return [
        <ConnectorConfig key="connectorconfig" params={params} isEditableFlow={isEditableFlow} />,
        <ConnectionDiscover key="connectiondiscover" params={params} isEditableFlow={isEditableFlow} />,
        <ConnectionSchedule key="connectionschedule" params={params} isEditableFlow={isEditableFlow} />
      ];
    }
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

        <Wizard header={<HorizontalLinearStepper steps={connectionSteps} />} wrapper={<Paper variant="outlined" />}>
          {getWizardStepContent()}
        </Wizard>
      </PageLayout>
    </OAuthContextProvider>
  );
};

export default ConnectionFormComponent;
