/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, April 4th 2024, 6:29:10 pm
 * Author: Nagendra S @ valmi.io
 */

import FormControlComponent from '@/components/FormControlComponent';
import { useState } from 'react';
import { JsonFormsCore } from '@jsonforms/core';
import { FormStatus, jsonFormValidator } from '@/utils/form-utils';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import { useSelector } from 'react-redux';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import { useWizard } from 'react-use-wizard';
import { WizardFooter } from '@/components/Wizard/Footer';
import { RootState } from '@/store/reducers';
import { TConnectionUpsertProps } from '@/pagesspaces/[wid]/connections/create';
import { useLazyCreateConnectionQuery } from '@/store/api/apiSlice';
import { getErrorsInData, getErrorsInErrorObject, hasErrorsInData } from '@/components/Error/ErrorUtils';
import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';

const getRunInterval = (name: string) => {
  const intervals = [
    { type: 'MIN', val: 1, name: 'Every 1 minute' },
    { type: 'MIN', val: 5, name: 'Every 5 minute' },
    { type: 'MIN', val: 10, name: 'Every 10 minutes' },
    { type: 'MIN', val: 15, name: 'Every 15 minutes' },
    { type: 'MIN', val: 30, name: 'Every 30 minutes' },
    { type: 'HOUR', val: 1, name: 'Every 1 hour' }
  ];

  //@ts-ignore
  const { val = 0, type = '' } = intervals.find((int) => name === int.name);

  const runInterval = val * (type == 'HOUR' ? 3600 : 60) * 1000; // inteval in milliseconds.
  return runInterval;
};

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of the connection'
    },
    connection_interval: {
      type: 'string',
      enum: [
        'Every 1 minute',
        'Every 2 minutes',
        'Every 5 minutes',
        'Every 15 minutes',
        'Every 30 minutes',
        'Every 1 hour'
      ],
      description: 'Connection interval'
    }
  },
  required: ['name', 'connection_interval']
};

const ConnectionSchedule = ({ params }: TConnectionUpsertProps) => {
  const { wid = '', type = '' } = params ?? {};
  const { previousStep } = useWizard();
  let initialData = {};

  const [data, setData] = useState<any>(initialData);

  // form state
  const [status, setStatus] = useState<FormStatus>('empty');

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days'] });

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const user = useSelector((state: RootState) => state.user.user);

  // reset password query
  const [createConnection, { isFetching }] = useLazyCreateConnectionQuery();

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
  };

  const { valid } = jsonFormValidator(schema, data);

  /**
   * Responsible for opening alert dialog.
   */
  const handleAlertOpen = ({ message = '', alertType }: { message: string | any; alertType: AlertStatus }) => {
    setAlertState({
      message: message,
      show: true,
      type: alertType
    });
  };

  /**
   * Responsible for closing alert dialog.
   */
  const handleAlertClose = () => {
    setAlertState({
      message: '',
      show: false,
      type: 'empty'
    });
  };

  const handleOnClick = () => {
    setStatus('submitting');

    const credentialObj = connectionDataFlow?.entities[0]?.config?.config ?? {};
    const streams = connectionDataFlow?.entities[1]?.streams ?? {};

    const credentialPayload = generateCredentialPayload(credentialObj);

    const connectionPayload = generateConnectionPayload(streams);

    const payload = {
      workspaceId: wid,

      credentialPayload,
      connectionPayload
    };

    handleCreateConnection(payload);
  };

  const handleCreateConnection = async (payload: any) => {
    try {
      const data: any = await createConnection(payload).unwrap();

      if (hasErrorsInData(data)) {
        setStatus('error');

        const traceError = getErrorsInData(data);

        handleAlertOpen({ message: traceError, alertType: 'error' });
      } else {
        setStatus('success');
        handleAlertOpen({ message: 'Connection created successfully!', alertType: 'success' });
      }
    } catch (error) {
      const errors = getErrorsInErrorObject(error);
      const { message = 'unknown' } = errors || {};

      setStatus('error');
      handleAlertOpen({ message: message, alertType: 'error' });
    }
  };

  const generateCredentialPayload = (credentialConfig: any) => {
    const payload = {
      connector_type: type,
      connector_config: credentialConfig,
      name: type,
      account: generateAccountPayload()
    };

    return payload;
  };

  const generateAccountPayload = () => {
    //@ts-ignore
    const { email = '', first_name = '' } = user || {};

    const payload = {
      name: first_name,
      external_id: email,
      profile: '',
      meta_data: {}
    };

    return payload;
  };

  const generateConnectionPayload = (streams: any[]) => {
    let connectionPayload: any = {};

    const { name = '', connection_interval = '' } = data ?? {};
    connectionPayload['src'] = generateSourcePayload(streams);
    connectionPayload['dest'] = generateDestinationPayload();
    connectionPayload['schedule'] = { run_interval: getRunInterval(connection_interval) };
    connectionPayload['uiState'] = {};
    connectionPayload['connectionName'] = name;
    connectionPayload['workspaceId'] = wid;

    return connectionPayload;
  };

  const generateSourcePayload = (streams: any[]) => {
    const sourcePayload = {
      catalog: {
        streams: streams
      }
    };
    return sourcePayload;
  };

  const generateDestinationPayload = () => {
    return {};
    const destinationPayload = {
      catalog: {
        sinks: []
      },
      credential_id: '',
      name: ''
    };

    return destinationPayload;
  };

  return (
    <>
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        displayButton={false}
        isError={alertState.type === 'error'}
      />
      <ConnectorLayout title={''}>
        <FormControlComponent
          key={`ConnectionSchedule`}
          editing={false}
          onFormChange={handleFormChange}
          error={false}
          status={status}
          jsonFormsProps={{ data: data, schema: schema, renderers: customRenderers }}
          removeAdditionalFields={false}
          displayActionButton={false}
        />
      </ConnectorLayout>

      <WizardFooter
        disabled={!valid || isFetching}
        prevDisabled={isFetching}
        nextButtonTitle={'Create'}
        onNextClick={handleOnClick}
        onPrevClick={() => previousStep()}
      />
    </>
  );
};

export default ConnectionSchedule;
