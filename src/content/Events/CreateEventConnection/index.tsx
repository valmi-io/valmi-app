/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { memo, useState } from 'react';

import { useSelector } from 'react-redux';
import {
  getDestinationSelectors,
  getLinkSelectors,
  useCreateLinkMutation,
  useDeleteLinkMutation,
  useLinkSchemaQuery
} from '@store/api/streamApiSlice';
import { RootState } from '@store/reducers';
import { Card } from '@mui/material';
import ErrorContainer from '@components/Error/ErrorContainer';
import SkeletonLoader from '@components/SkeletonLoader';
import { JsonFormsCore } from '@jsonforms/core';
import { isTrue } from '@utils/lib';
import { _ } from 'numeral';
import { useRouter } from 'next/router';
import { FormStatus, jsonFormRemoveAdditionalFields } from '@/utils/form-utils';
import { useFetch } from '@/hooks/useFetch';
import { ErrorStatusText } from '@/components/Error';
import FormControlComponent from '@/components/FormControlComponent';
import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import { queryHandler } from '@/services';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

export type LinkStateType = {
  fromId: string;
  toId: string;
  type: string;
};

type CreateTrackProps = {
  linkState: LinkStateType;
};

const CreateTrack = ({ linkState }: CreateTrackProps) => {
  const { fromId, toId, type } = linkState;

  const router = useRouter();

  const { workspaceId = null } = useWorkspaceId();

  // Getting from redux to decide creating/editing
  const { editing, id: linkId } = useSelector((state: RootState) => state.trackFlow);

  // Getting stream selectors for editing case specifically - not useful for create case
  const { selectAllLinks, selectLinkById } = getLinkSelectors(workspaceId as string);
  const linkData = useSelector((state) => selectLinkById(state, linkId));

  // Getting selectors for destinations
  const { selectAllDestinations, selectDestinationById } = getDestinationSelectors(workspaceId as string);
  const destinationData = useSelector((state) => selectDestinationById(state, toId));

  const { destinationType = '' } = destinationData ?? {};

  // Getting schema for the object
  const {
    data: schema,
    isLoading,
    traceError,
    error
  } = useFetch({ query: useLinkSchemaQuery({ workspaceId, type: type ? type : destinationType }) });

  // Initialise data
  let initialData = {
    fromId: fromId,
    toId: toId,
    data: {
      dataLayout: 'segment'
    }
  };

  if (isTrue(editing)) {
    initialData = linkData;
  }

  const [data, setData] = useState<any>(initialData);

  // Mutation for creating Schema object
  const [createObject, { error: createError }] = useCreateLinkMutation();

  // Mutation for deleting Schema object
  const [deleteObject, { isLoading: isDeleting, error: deleteError }] = useDeleteLinkMutation();

  // form state - form can be in any of the states {FormStatus}
  const [status, setStatus] = useState<FormStatus>('empty');

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  const invisibleFields = ['fromId', 'toId', 'functions', 'batchSize', 'dataLayout'];

  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: invisibleFields });

  const handleSubmit = () => {
    setStatus('submitting');
    let ndata = jsonFormRemoveAdditionalFields(schema, data);
    if (editing) {
      ndata = { ...ndata, id: linkId };
    }
    const payload = { workspaceId: workspaceId, link: ndata, editing: editing };

    connectionQueryHandler({ query: createObject, payload: payload });
  };

  const successCb = (data: any) => {
    setStatus('success');
    handleNavigationOnSuccess();
  };

  const errorCb = (error: any) => {
    setStatus('error');
    handleAlertOpen({ message: error, alertType: 'error' as AlertStatus });
  };

  const connectionQueryHandler = async ({ query, payload }: { query: any; payload: any }) => {
    await queryHandler({ query, payload, successCb, errorCb });
  };

  const handleDelete = () => {
    const payload = { workspaceId: workspaceId, linkId: linkId, fromId: fromId, toId: toId };
    connectionQueryHandler({ query: deleteObject, payload: payload });
  };

  const handleNavigationOnSuccess = () => {
    router.back();
  };

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

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
  };

  return (
    <Card>
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
      />
      {/** Display error */}
      {error && <ErrorContainer error={error} />}

      {/** Display trace error*/}
      {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

      {/** Display skeleton */}
      <SkeletonLoader loading={isLoading} />

      {/** Display page content */}
      {!error && !isLoading && schema && (
        <FormControlComponent
          key={`TrackFormControl`}
          deleteTooltip="Delete track"
          editing={!!editing}
          onDelete={handleDelete}
          onFormChange={handleFormChange}
          onSubmitClick={handleSubmit}
          isDeleting={isDeleting}
          status={status}
          error={createError ?? deleteError}
          removeAdditionalFields={true}
          jsonFormsProps={{ data: data, schema: schema, renderers: customRenderers }}
          containerStyles={{ width: '100%' }}
        />
      )}
    </Card>
  );
};

export default memo(CreateTrack);
