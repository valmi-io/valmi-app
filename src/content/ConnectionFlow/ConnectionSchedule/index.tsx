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
import { useDispatch, useSelector } from 'react-redux';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import { useWizard } from 'react-use-wizard';
import { WizardFooter } from '@/components/Wizard/Footer';
import { RootState } from '@/store/reducers';
import { TConnectionUpsertProps } from '@/pagesspaces/[wid]/connections/create';
import { getErrorsInData, getErrorsInErrorObject, hasErrorsInData } from '@/components/Error/ErrorUtils';
import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import {
  connectionScheduleSchema,
  generateConnectionPayload,
  generateCredentialPayload,
  getCatalogObjKey,
  getCredentialObjKey,
  getExtrasObjKey,
  getScheduleObjKey,
  getSelectedConnectorKey
} from '@/utils/connectionFlowUtils';
import { useRouter } from 'next/router';
import { AppDispatch } from '@/store/store';
import { clearConnectionFlowState } from '@/store/reducers/connectionDataFlow';
import Spinner from '@/components/Spinner';
import { useLazyCreateConnectionQuery, useLazyUpdateConnectionQuery } from '@/store/api/connectionApiSlice';

const ConnectionSchedule = ({ params, isEditableFlow }: TConnectionUpsertProps) => {
  const router = useRouter();
  const { wid = '' } = params ?? {};

  const dispatch = useDispatch<AppDispatch>();
  let initialData = {};

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  if (connectionDataFlow.entities[getScheduleObjKey()]) {
    initialData = connectionDataFlow?.entities[getScheduleObjKey()] ?? {};
  }

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const { type = '' } = selectedConnector;

  const streams = connectionDataFlow?.entities[getCatalogObjKey(type)]?.streams;

  if (streams) {
    initialData = {
      name: type?.toLocaleLowerCase(),
      run_interval: 'Every 1 hour'
    };
  }

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { user } = appState ?? {};

  // create connection query
  const [createConnection] = useLazyCreateConnectionQuery();

  // update connection query
  const [updateConnection] = useLazyUpdateConnectionQuery();

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

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
  };

  useEffect(() => {
    if (streams) {
      handleOnClick();
    }
  }, [streams]);

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

    let credentialObj = connectionDataFlow?.entities[getCredentialObjKey(type)]?.config ?? {};
    const streams = connectionDataFlow?.entities[getCatalogObjKey(type)]?.streams ?? {};

    const extras = connectionDataFlow?.entities[getExtrasObjKey()] ?? {};

    let credentialPayload = null;
    let destCredentialPayload = null;

    const connectionPayload = generateConnectionPayload(streams, data, wid, isEditableFlow, extras);

    const payload: any = {
      workspaceId: wid,
      connectionPayload
    };

    if (!isEditableFlow) {
      credentialPayload = generateCredentialPayload(credentialObj, type, user);
      destCredentialPayload = generateCredentialPayload(credentialObj, 'DEST_POSTGRES-DEST', user);
      payload['credentialPayload'] = credentialPayload;
      payload['destCredentialPayload'] = destCredentialPayload;
    }

    const query = isEditableFlow ? updateConnection : createConnection;

    createOrUpdateConnection(payload, query);
  };

  const createOrUpdateConnection = async (payload: any, query: any) => {
    try {
      const data: any = await query(payload).unwrap();

      if (hasErrorsInData(data)) {
        setStatus('error');

        const traceError = getErrorsInData(data);

        handleAlertOpen({ message: traceError, alertType: 'error' });
      } else {
        setStatus('success');
        handleAlertOpen({ message: 'Connection created successfully!', alertType: 'success' });
        dispatch(clearConnectionFlowState());
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
      {status === 'submitting' && <Spinner />}
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        displayButton={false}
        isError={alertState.type === 'error'}
      />
      <ConnectorLayout title={''}>
        <FormControlComponent
          disabled={true}
          key={`ConnectionSchedule`}
          editing={false}
          onFormChange={handleFormChange}
          error={false}
          jsonFormsProps={{ data: data, schema: connectionScheduleSchema, renderers: customRenderers }}
          removeAdditionalFields={false}
          displayActionButton={false}
        />
      </ConnectorLayout>

      {/* <WizardFooter
        status={status}
        disabled={!valid || isCreating || isUpdating}
        prevDisabled={isCreating || isUpdating}
        nextButtonTitle={isEditableFlow ? 'Update' : 'Create'}
        onNextClick={handleOnClick}
        onPrevClick={() => previousStep()}
      /> */}
    </>
  );
};

export default ConnectionSchedule;
