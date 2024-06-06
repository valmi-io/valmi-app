import { JsonFormsWrapper } from '@/components/JsonFormsWrapper';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import { formValidationMode } from '@/utils/form-utils';
import { Paper, styled } from '@mui/material';
import React from 'react';

const FormLayout = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: theme.spacing(1, 0),
  maxWidth: '520px'
}));

interface IAuthenticationForm {
  formValidationState: formValidationMode;
  handleFormDataChange: (data: any) => void;
  formData: any;
  schema: any;
}

const AuthenticationForm = ({ formValidationState, handleFormDataChange, formData, schema }: IAuthenticationForm) => {
  /**
   * Retrieves custom renderers for the JSONForms component based on the provided configuration
   * (e.g., hiding specific fields).
   */
  const handleFormRenderers = getCustomRenderers({ invisibleFields: ['invisible_fields'] });
  return (
    <FormLayout>
      <JsonFormsWrapper
        formValidationState={formValidationState}
        onChange={handleFormDataChange}
        renderers={handleFormRenderers}
        schema={schema}
        data={formData}
      />
    </FormLayout>
  );
};

export default AuthenticationForm;
