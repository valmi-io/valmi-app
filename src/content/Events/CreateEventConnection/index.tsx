/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { memo, useEffect, useState } from 'react';

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
import { getErrorsInErrorObject } from '@/components/Error/ErrorUtils';
import { getCustomRenderers } from '@/utils/form-customRenderers';

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
  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const { workspaceId = '' } = appState;

  // Getting from redux to decide creating/editing
  const { editing, id: linkId } = useSelector((state: RootState) => state.trackFlow);

  // Getting stream selectors for editing case specifically - not useful for create case
  const { selectAllLinks, selectLinkById } = getLinkSelectors(workspaceId as string);
  const linkData = useSelector((state) => selectLinkById(state, linkId));

  // Getting selectors for destinations
  const { selectAllDestinations, selectDestinationById } = getDestinationSelectors(workspaceId as string);
  const destinationData = useSelector((state) => selectDestinationById(state, toId));

  // Getting schema for the object
  const {
    data: schema,
    isLoading,
    traceError,
    error
  } = useFetch({ query: useLinkSchemaQuery({ workspaceId, type: type ? type : destinationData.destinationType }) });

  // Initialise data
  let initialData = {
    fromId: fromId,
    toId: toId
  };

  if (isTrue(editing)) {
    initialData = linkData;
  }

  const [data, setData] = useState<any>(initialData);

  // Mutation for creating Schema object
  const [createObject, { isLoading: isCreating, isSuccess: isCreated, isError: isCreateError, error: createError }] =
    useCreateLinkMutation();

  // Mutation for deleting Schema object
  const [deleteObject, { isLoading: isDeleting, isSuccess: isDeleted, isError: isDeleteError, error: deleteError }] =
    useDeleteLinkMutation();

  // form state - form can be in any of the states {FormStatus}
  const [status, setStatus] = useState<FormStatus>('empty');

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  const invisibleFields = ['fromId', 'toId', 'functions', 'batchSize'];

  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: invisibleFields });

  useEffect(() => {
    if (isCreated || isDeleted) {
      setStatus('success');
      handleNavigationOnSuccess();
    }
  }, [isCreated, isDeleted]);

  useEffect(() => {
    if (isCreateError || isDeleteError) {
      setStatus('error');
      // extract errors from createError || deleteError object
      const errors = getErrorsInErrorObject(createError || deleteError);

      const { message = '' } = errors || {};

      // open alert dialog
      handleAlertOpen({ message: message || deleteError, alertType: 'error' as AlertStatus });
    }
  }, [isCreateError, isDeleteError]);

  const handleSubmit = () => {
    setStatus('submitting');
    let ndata = jsonFormRemoveAdditionalFields(schema, data);
    if (editing) {
      ndata = { ...ndata, id: linkId };
    }
    const payload = { workspaceId: workspaceId, link: ndata };

    createObject(payload);
  };

  const handleDelete = () => {
    const payload = { workspaceId: workspaceId, linkId: linkId, fromId: fromId, toId: toId };
    deleteObject(payload);
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
