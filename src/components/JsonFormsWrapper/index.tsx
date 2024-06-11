import { formValidationMode, translateFormError } from '@/utils/form-utils';
import { JsonFormsCore, JsonSchema } from '@jsonforms/core';
import { materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { useState } from 'react';

interface JsonFormData {
  // Define the type of your form data here based on your schema
  [key: string]: any; // Replace with specific types
}

interface JsonFormsWrapperProps {
  schema: JsonSchema; // Use the type from @jsonforms/react
  data?: JsonFormData; // Optional initial data with specific types
  onChange: any; // Callback with typed data,
  renderers: any;
  formValidationState: formValidationMode;
}

export const JsonFormsWrapper = ({ schema, data, onChange, renderers, formValidationState }: JsonFormsWrapperProps) => {
  return (
    <JsonForms
      i18n={{ translateError: translateFormError }}
      schema={schema}
      data={data}
      renderers={renderers}
      cells={materialCells}
      onChange={onChange}
      validationMode={formValidationState}
    />
  );
};
