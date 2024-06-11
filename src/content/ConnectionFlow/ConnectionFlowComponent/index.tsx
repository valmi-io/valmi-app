import constants from '@/constants';
import ConnectionConfig from '@/content/ConnectionFlow/ConnectionConfig';
import { OAuthContextProvider } from '@/contexts/OAuthContext';
import PageLayout from '@/layouts/PageLayout';
import { RootState } from '@/store/reducers';
import { getExtrasObjKey } from '@/utils/connectionFlowUtils';
import { isObjectEmpty } from '@/utils/lib';
import { Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { Wizard } from 'react-use-wizard';

const ConnectionFlowComponent = ({ params }: { params: any }) => {
  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const extras = connectionDataFlow.entities[getExtrasObjKey()] ?? {};

  const isEditableFlow = !!(!isObjectEmpty(extras) && extras?.isEditableFlow);

  const getWizardStepContent = () => {
    const steps = [<ConnectionConfig key="connectorconfig" params={params} isEditableFlow={isEditableFlow} />];

    return steps;
  };

  const renderComponent = () => {
    return (
      <Wizard header={null} wrapper={<Paper variant="elevation" />}>
        {getWizardStepContent()}
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
