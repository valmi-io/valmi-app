import HorizontalLinearStepper, { Step } from '@/components/Stepper';
import constants from '@/constants';
import ConnectionDiscover from '@/content/ConnectionFlow/ConnectionDiscover';
import ConnectionSchedule from '@/content/ConnectionFlow/ConnectionSchedule';
import ConnectionConfig from '@/content/ConnectionFlow/ConnectionConfig';
import { OAuthContextProvider } from '@/contexts/OAuthContext';
import PageLayout from '@/layouts/PageLayout';
import { RootState } from '@/store/reducers';
import { setIds } from '@/store/reducers/connectionDataFlow';
import { AppDispatch } from '@/store/store';
import {
  getConnectionFlowSteps,
  getSelectedConnectorKey,
  getShopifyIntegrationType,
  isConnectionAutomationFlow
} from '@/utils/connectionFlowUtils';
import { Paper } from '@mui/material';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wizard } from 'react-use-wizard';

const ConnectionFlowComponent = ({ params }: { params: any }) => {
  const { cid = '' } = params ?? {};

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const { type = '', mode = '' } = selectedConnector;

  const isEditableFlow = !!cid;

  const dispatch = useDispatch<AppDispatch>();

  const connectionSteps = useMemo(() => {
    console.log('get connection steps:_', getConnectionFlowSteps(mode, isEditableFlow));

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

  const getWizardStepContent = ({ isAutomationFlow }: { isAutomationFlow: boolean }) => {
    const steps = [
      <ConnectionConfig key="connectorconfig" params={params} isEditableFlow={isEditableFlow} />,
      <ConnectionDiscover key="connectiondiscover" params={params} isEditableFlow={isEditableFlow} />,
      <ConnectionSchedule key="connectionschedule" params={params} isEditableFlow={isEditableFlow} />
    ];

    if (isAutomationFlow) {
      return steps[0];
    }

    if (isEditableFlow) return steps.slice(1, steps.length);
    return steps;
  };

  const renderComponent = () => {
    const isAutomationFlow = isConnectionAutomationFlow({ mode, type });

    return (
      <Wizard
        header={!isAutomationFlow && <HorizontalLinearStepper steps={connectionSteps} />}
        wrapper={<Paper variant="outlined" />}
      >
        {getWizardStepContent({ isAutomationFlow })}
      </Wizard>
    );
  };

  return (
    <OAuthContextProvider>
      <PageLayout
        pageHeadTitle={constants.connections.CREATE_CONNECTION_TITLE}
        title={isEditableFlow ? 'Edit connection' : 'Create a new connection'}
        displayButton={false}
      >
        {/** Stepper */}
        {renderComponent()}
      </PageLayout>
    </OAuthContextProvider>
  );
};

export default ConnectionFlowComponent;
