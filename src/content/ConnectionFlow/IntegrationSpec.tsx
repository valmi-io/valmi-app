import ErrorComponent, { ErrorStatusText } from '@/components/Error';
import { JsonFormsWrapper } from '@/components/JsonFormsWrapper';
import SkeletonLoader from '@/components/SkeletonLoader';
import SubmitButton from '@/components/SubmitButton';
import CatalogInstuctions from '@/content/Catalog/CatalogInstuctions';
import { OAuthContext } from '@/contexts/OAuthContext';
import FormLayout from '@/layouts/FormLayout';
import { RootState } from '@/store/reducers';
import { getSelectedConnectorKey, isETLFlow } from '@/utils/connectionFlowUtils';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import { FormStatus, formValidationMode, jsonFormValidator } from '@/utils/form-utils';
import { JsonFormsCore } from '@jsonforms/core';
import { Stack, styled } from '@mui/material';
import { useContext, useState } from 'react';
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
  onClick
}: {
  isEditableFlow: boolean;
  mode: string;
  type: string;
  status: FormStatus;
  onClick: () => void;
}) => {
  const getButtonTitle = () => {
    return isEditableFlow ? 'UPDATE' : isETLFlow({ mode, type }) ? 'CREATE' : 'CHECK';
  };

  return (
    <FormButtonStack>
      <SubmitButton
        buttonText={getButtonTitle()}
        data={status === 'success'}
        isFetching={status === 'submitting'}
        size="small"
        disabled={status === 'submitting'}
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
      return (
        <IntegrationForm data={specData} isEditableFlow={isEditableFlow} status={status} handleSubmit={handleSubmit} />
      );
    }
  };

  return <>{renderComponent()}</>;
};

export default IntegrationSpec;

const IntegrationForm = ({
  data,
  isEditableFlow,
  status,
  handleSubmit
}: {
  data: any;
  isEditableFlow: boolean;
  status: FormStatus;
  handleSubmit: (payload: any) => void;
}) => {
  const schema: any = data?.spec?.connectionSpecification ?? {};

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const { type = '', mode = '' } = selectedConnector;

  const { formState, setFormState } = useContext(OAuthContext);
  const [formValidationState, setFormValidationState] = useState<formValidationMode>('ValidateAndHide');

  /**
   * Retrieves custom renderers for the JSONForms component based on the provided configuration
   * (e.g., hiding specific fields).
   */
  const handleFormRenderers = getCustomRenderers({
    invisibleFields: ['auth_method', 'auth_type', 'custom_reports', 'window_in_days']
  });

  /**
   * Validates the user-submitted data (`formData`) against the defined schema (`schema`)
   * and returns an object containing a `valid` flag and any encountered `errors`.
   */
  const { valid, errors } = jsonFormValidator(schema, formState);

  /**
   * Updates the `formData` state with the new data received from the JSONForms component
   * when the user interacts with the form.
   */
  const handleFormDataChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setFormState(data);
  };

  const handleOnClick = () => {

    if (!valid) {
      setFormValidationState('ValidateAndShow');
      return;
    }

    handleSubmit(formState);
  };

  return (
    <FormLayout
      formComp={
        <>
          <JsonFormsWrapper
            readonly={status === 'submitting'}
            formValidationState={formValidationState}
            onChange={handleFormDataChange}
            renderers={handleFormRenderers}
            schema={schema}
            data={formState}
          />
          <FormButton
            key={'FormButton'}
            isEditableFlow={isEditableFlow}
            mode={mode}
            type={type}
            status={status}
            onClick={handleOnClick}
          />
        </>
      }
      instructionsComp={<CatalogInstuctions data={data} selected_connector={selectedConnector} />}
    />
  );
};
