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
import {
  connectionScheduleSchema,
  generateConnectionPayload,
  generateCredentialPayload
} from '@/utils/connectionFlowUtils';
import { useRouter } from 'next/router';

const ConnectionSchedule = ({ params }: TConnectionUpsertProps) => {
  const router = useRouter();
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

  const { valid } = jsonFormValidator(connectionScheduleSchema, data);

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

    const credentialPayload = generateCredentialPayload(credentialObj, type, user);

    const destCredentialPayload = generateCredentialPayload(credentialObj, 'DEST_POSTGRES-DEST', user);

    const connectionPayload = generateConnectionPayload(streams, data, wid);

    const payload = {
      workspaceId: wid,
      credentialPayload,
      destCredentialPayload,
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
        router.push(`/spaces/${wid}/connections`);
      }
    } catch (error) {
      const errors = getErrorsInErrorObject(error);
      const { message = 'unknown' } = errors || {};

      setStatus('error');
      handleAlertOpen({ message: message, alertType: 'error' });
    }
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
          jsonFormsProps={{ data: data, schema: connectionScheduleSchema, renderers: customRenderers }}
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
