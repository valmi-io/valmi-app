/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 5th 2024, 6:21:59 pm
 * Author: Nagendra S @ valmi.io
 */

import SubmitButton from '@/components/SubmitButton';
import { FormContainer } from '@/layouts/FormLayout';
import { FormStatus, jsonFormRemoveAdditionalFields, jsonFormValidator } from '@/utils/form-utils';
import { materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Box } from '@mui/material';

type JsonFormsProps = {
  schema: any;
  data: any;
  renderers?: any;
};

type FormControlComponentProps = {
  jsonFormsProps: JsonFormsProps;
  editing: boolean;
  deleteTooltip: string;
  isDeleting: boolean;
  onDelete: () => void;
  status?: FormStatus;
  error?: any;
  onFormChange: any;
  onSubmitClick: () => void;
  removeAdditionalFields?: boolean;
  containerStyles?: React.CSSProperties;
};

const FormControlComponent = ({
  jsonFormsProps,
  deleteTooltip = '',
  editing,
  isDeleting,
  onDelete,
  onFormChange,
  status,
  error,
  removeAdditionalFields = false,
  containerStyles,
  onSubmitClick
}: FormControlComponentProps) => {
  const { data, schema, renderers } = jsonFormsProps;

  const { valid, errors } = removeAdditionalFields
    ? jsonFormValidator(schema, jsonFormRemoveAdditionalFields(schema, data))
    : jsonFormValidator(schema, data);

  return (
    <FormContainer>
      <JsonForms schema={schema} data={data} renderers={renderers} cells={materialCells} onChange={onFormChange} />

      <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: editing ? 'space-between' : 'flex-end' }}>
        {editing && (
          <SubmitButton
            buttonText={'Delete'}
            data={status === 'success'}
            isFetching={isDeleting}
            disabled={isDeleting}
            color="error"
            onClick={onDelete}
          />
        )}
        <SubmitButton
          buttonText={'Check'}
          data={status === 'success'}
          isFetching={status === 'submitting'}
          disabled={!valid || status === 'submitting' || isDeleting}
          onClick={onSubmitClick}
        />
      </Box>
    </FormContainer>
  );
};

export default FormControlComponent;
