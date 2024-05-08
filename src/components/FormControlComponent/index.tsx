/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 5th 2024, 6:21:59 pm
 * Author: Nagendra S @ valmi.io
 */

import SubmitButton from '@/components/SubmitButton';
import { OAuthContext } from '@/contexts/OAuthContext';
import { FormContainer } from '@/layouts/FormLayout';
import { FormStatus, jsonFormRemoveAdditionalFields, jsonFormValidator } from '@/utils/form-utils';
import { materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Box } from '@mui/material';
import { useContext } from 'react';

type JsonFormsProps = {
  schema: any;
  data: any;
  uischema?: any;
  renderers?: any;
};

type FormControlComponentProps = {
  jsonFormsProps: JsonFormsProps;
  editing: boolean;
  deleteTooltip?: string;
  isDeleting?: boolean;
  onDelete?: () => void;
  status?: FormStatus;
  error?: any;
  onFormChange: any;
  onSubmitClick?: () => void;
  removeAdditionalFields?: boolean;
  containerStyles?: React.CSSProperties;
  displayActionButton?: boolean;
  disabled?: boolean;
  enableCreate?: boolean;
  onCreateAutomation?: () => void;
};

const FormControlComponent = ({
  jsonFormsProps,
  deleteTooltip = '',
  editing,
  isDeleting = false,
  onDelete,
  onFormChange,
  status,
  error,
  removeAdditionalFields = false,
  containerStyles,
  onSubmitClick,
  displayActionButton = true,
  disabled,
  enableCreate,
  onCreateAutomation
}: FormControlComponentProps) => {
  const { data, schema, renderers } = jsonFormsProps;

  const { valid, errors } = removeAdditionalFields
    ? jsonFormValidator(schema, jsonFormRemoveAdditionalFields(schema, data))
    : jsonFormValidator(schema, data);

  const { isoAuthStepDone } = useContext(OAuthContext);

  return (
    <FormContainer>
      <JsonForms
        readonly={!!(status === 'submitting' || disabled)}
        schema={schema}
        data={data}
        renderers={renderers}
        cells={materialCells}
        onChange={onFormChange}
      />

      {displayActionButton && (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: editing ? 'space-between' : 'flex-end',
            gap: 3
          }}
        >
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
            disabled={!valid || status === 'submitting' || (isDeleting && !isoAuthStepDone)}
            onClick={onSubmitClick}
          />
          {enableCreate && (
            <SubmitButton
              buttonText={'Create'}
              data={''}
              isFetching={false}
              disabled={!enableCreate}
              onClick={onCreateAutomation}
            />
          )}
        </Box>
      )}
    </FormContainer>
  );
};

export default FormControlComponent;
