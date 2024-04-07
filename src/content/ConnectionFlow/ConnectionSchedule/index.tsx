/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, April 4th 2024, 6:29:10 pm
 * Author: Nagendra S @ valmi.io
 */

import FormControlComponent from '@/components/FormControlComponent';
import { useEffect, useState } from 'react';
import { JsonFormsCore } from '@jsonforms/core';
import { FormStatus } from '@/utils/form-utils';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of the connection'
    },
    connection_interval: {
      type: 'string',
      enum: ['Every 30 minutes', 'Every hour', 'Every 3 hours', 'Every 5 hours', 'Every 24 hours'],
      description: 'Connection interval'
    }
  },
  required: ['name', 'connection_interval']
};

const ConnectionSchedule = () => {
  let initialData = {};

  const dispatch = useDispatch<AppDispatch>();

  const [data, setData] = useState<any>(initialData);

  // form state
  const [status, setStatus] = useState<FormStatus>('empty');

  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days'] });

  const handleSubmit = () => {
    console.log('handleSubmit data', data);
  };

  const handleDelete = () => {
    console.log('handle delete');
  };

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
  };

  useEffect(() => {
    console.log('dispatch schedule flow:_');
  }, []);

  return (
    <FormControlComponent
      key={`ConnectionSchedule`}
      deleteTooltip="Delete Schedule"
      editing={false}
      onDelete={handleDelete}
      onFormChange={handleFormChange}
      onSubmitClick={handleSubmit}
      isDeleting={false}
      status={status}
      error={false}
      jsonFormsProps={{ data: data, schema: schema, renderers: customRenderers }}
      removeAdditionalFields={false}
    />
  );
};

export default ConnectionSchedule;
