import { getCustomRenderers } from '@/utils/form-customRenderers';
import { jsonFormValidator } from '@/utils/form-utils';
import { Generate, JsonFormsCore } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import { Card, Paper, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import { schema } from '@content/Prompts/promptUtils';
import SubmitButton from '@/components/SubmitButton';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import transformFilters from '@utils/filter-util'

const PromptFilter = ({ spec, applyFilters }: { spec: any; applyFilters: (data: any) => void }) => {
  let initialData = {};

  const [data, setData] = useState<any>(initialData);
  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days'] });

  const { valid, errors } = jsonFormValidator(spec, data);

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
  };

  const customUISchema = useMemo(() => {
    const uischema = Generate.uiSchema(spec);
    uischema['type'] = 'HorizontalLayout';
    return uischema;
  }, [spec]);

  const handleOnClick = () => {
    let obj = transformFilters(data);
    applyFilters(obj);
  };

  return (
    <Paper variant="outlined">
      <JsonForms
        schema={spec}
        uischema={customUISchema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={handleFormChange}
      />

      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <SubmitButton
          buttonText={'Apply filters'}
          data={false}
          isFetching={false}
          disabled={!valid}
          onClick={handleOnClick}
        />
      </Stack>
    </Paper>
  );
};

export default PromptFilter;
