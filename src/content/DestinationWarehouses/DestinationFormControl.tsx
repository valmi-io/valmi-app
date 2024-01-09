/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 5th 2024, 10:05:52 am
 * Author: Nagendra S @ valmi.io
 */

import CustomIcon from '@/components/Icon/CustomIcon';
import SubmitButton from '@/components/SubmitButton';
import { FormContainer } from '@/layouts/FormLayout';
import { FormStatus, jsonFormValidator } from '@/utils/form-utils';
import appIcons from '@/utils/icon-utils';
import { materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Tooltip, IconButton } from '@mui/material';
import { Box } from '@mui/material';

type JsonFormsProps = {
  schema: any;
  data: any;
  renderers?: any;
};

type DestinationFormContrlProps = {
  jsonFormsProps: JsonFormsProps;
  editing: boolean;
  deleteTooltip: string;
  isDeleting: boolean;
  onDelete: () => void;
  status?: FormStatus;
  error?: any;
  onFormChange: any;
  onSubmitClick: () => void;
};

const DestinationFormControl = ({
  jsonFormsProps,
  deleteTooltip = '',
  editing,
  isDeleting,
  onDelete,
  onFormChange,
  status,
  error,
  onSubmitClick
}: DestinationFormContrlProps) => {
  const { data, schema, renderers } = jsonFormsProps;
  const { valid, errors } = jsonFormValidator(schema, data);

  return (
    <FormContainer>
      {editing && (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Tooltip title={deleteTooltip}>
            <Box component="span">
              <IconButton disabled={isDeleting} onClick={onDelete}>
                <CustomIcon icon={appIcons.DELETE} />
              </IconButton>
            </Box>
          </Tooltip>
        </Box>
      )}
      <JsonForms schema={schema} data={data} renderers={renderers} cells={materialCells} onChange={onFormChange} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <SubmitButton
          buttonText={'Submit'}
          data={status === 'success'}
          isFetching={status === 'submitting'}
          disabled={!valid || status === 'submitting'}
          onClick={onSubmitClick}
        />
      </Box>

      <pre>{errors.length > 0 && JSON.stringify(errors, null, 2)}</pre>
      <pre>{status === 'error' && JSON.stringify(error, null, 2)}</pre>
    </FormContainer>
  );
};

export default DestinationFormControl;
