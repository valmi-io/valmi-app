/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, April 4th 2024, 6:29:10 pm
 * Author: Nagendra S @ valmi.io
 */

import FormControlComponent from '@/components/FormControlComponent';
import { useEffect, useState } from 'react';
import { JsonFormsCore } from '@jsonforms/core';
import { jsonFormValidator } from '@/utils/form-utils';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import { useSelector } from 'react-redux';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import { useWizard } from 'react-use-wizard';
import { WizardFooter } from '@/components/Wizard/Footer';
import { RootState } from '@/store/reducers';

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
  const { previousStep } = useWizard();
  let initialData = {};

  const [data, setData] = useState<any>(initialData);

  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days'] });

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
  };

  const { valid } = jsonFormValidator(schema, data);

  const handleOnClick = () => {
    // handle connection object creation from here

    console.log('Connection data flow:_', connectionDataFlow);
    const credentialObj = connectionDataFlow?.entities[0]?.config ?? {};
    const streamsObj = connectionDataFlow?.entities[1]?.streams ?? {};

    console.log('Credential obj:_', credentialObj);

    console.log('Streams obj:_', streamsObj);
  };

  return (
    <>
      <ConnectorLayout title={''}>
        <FormControlComponent
          key={`ConnectionSchedule`}
          editing={false}
          onFormChange={handleFormChange}
          error={false}
          jsonFormsProps={{ data: data, schema: schema, renderers: customRenderers }}
          removeAdditionalFields={false}
          displayActionButton={false}
        />
      </ConnectorLayout>

      <WizardFooter
        disabled={!valid}
        nextButtonTitle={'Create'}
        onNextClick={handleOnClick}
        onPrevClick={() => previousStep()}
      />
    </>
  );
};

export default ConnectionSchedule;
