import ErrorComponent, { ErrorStatusText } from '@/components/Error';
import SkeletonLoader from '@/components/SkeletonLoader';
import SubmitButton from '@/components/SubmitButton';
import CatalogInstuctions from '@/content/Catalog/CatalogInstuctions';
import { OAuthContext } from '@/contexts/OAuthContext';
import FormLayout from '@/layouts/FormLayout';
import { RootState } from '@/store/reducers';
import { getSelectedConnectorKey, isConnectionAutomationFlow } from '@/utils/connectionFlowUtils';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import { FormStatus, jsonFormValidator } from '@/utils/form-utils';
import { JsonFormsCore } from '@jsonforms/core';
import { materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Stack, styled } from '@mui/material';
import { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';

const FormButtonStack = styled(Stack)(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center'
}));

const FormButton = ({
  isEditableFlow,
  mode,
  type,
  status,
  valid,
  onClick
}: {
  isEditableFlow: boolean;
  mode: string;
  type: string;
  status: FormStatus;
  valid: boolean;
  onClick: () => void;
}) => {
  const getButtonTitle = () => {
    return isEditableFlow ? 'UPDATE' : isConnectionAutomationFlow({ mode, type }) ? 'CREATE' : 'CHECK';
  };

  return (
    <FormButtonStack>
      <SubmitButton
        buttonText={getButtonTitle()}
        data={status === 'success'}
        isFetching={status === 'submitting'}
        size="small"
        disabled={!valid || status === 'submitting'}
        onClick={onClick}
      />
    </FormButtonStack>
  );
};

const IntegrationSpec = ({
  error,
  traceError,
  isLoading,
  specData,
  handleSubmit,
  status,
  isEditableFlow
}: {
  error: any;
  traceError: any;
  isLoading: boolean;
  specData: any;
  status: FormStatus;
  handleSubmit: (payload: any) => void;
  isEditableFlow: boolean;
}) => {
  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const { type = '', mode = '' } = selectedConnector;

  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: ['auth_method'] });

  const { formState, setFormState } = useContext(OAuthContext);

  const handleFormChange = async ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setFormState(data);
  };

  const handleOnClick = useCallback(() => {
    handleSubmit(formState);
  }, []);

  const renderComponent = () => {
    if (error) {
      return <ErrorComponent error={error} />;
    }

    if (traceError) {
      return <ErrorStatusText>{traceError}</ErrorStatusText>;
    }

    if (isLoading) {
      return <SkeletonLoader loading={isLoading} />;
    }

    if (specData) {
      const schema: any = specData?.spec?.connectionSpecification ?? {};

      const { valid } = jsonFormValidator(schema, formState);

      return (
        <FormLayout
          formComp={
            <>
              <JsonForms
                readonly={status === 'submitting'}
                schema={schema}
                data={formState}
                renderers={customRenderers}
                cells={materialCells}
                onChange={handleFormChange}
              />
              <FormButton
                key={'FormButton'}
                isEditableFlow={isEditableFlow}
                mode={mode}
                type={type}
                status={status}
                onClick={handleOnClick}
                valid={valid}
              />
            </>
          }
          instructionsComp={<CatalogInstuctions data={specData} selected_connector={selectedConnector} />}
        />
      );
    }
  };

  return <>{renderComponent()}</>;
};

export default IntegrationSpec;
