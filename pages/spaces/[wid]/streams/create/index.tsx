/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useEffect, useState } from 'react';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import {
  getStreamSelectors,
  useCreateStreamMutation,
  useDeleteStreamMutation,
  useEditStreamMutation,
  useStreamSchemaQuery
} from '@store/api/streamApiSlice';
import { RootState } from '@store/reducers';
import { generateUUID, isTrue } from '@/utils/lib';
import { useFetch } from '@/hooks/useFetch';
import ContentLayout from '@/layouts/ContentLayout';
import ConnectorLayout from '@/layouts/ConnectorLayout';

import FormLayout from '@/layouts/FormLayout';
import DestinationInstructions from '@/content/DestinationWarehouses/DestinationInstructions';
import { JsonFormsCore } from '@jsonforms/core';
import { FormStatus } from '@/utils/form-utils';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import { getErrorsInErrorObject } from '@/components/Error/ErrorUtils';
import FormControlComponent from '@/components/FormControlComponent';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const CreateStream = () => {
  const router = useRouter();

  const { workspaceId = null } = useWorkspaceId();

  // Getting schema for the object
  const { data: schema, isLoading, traceError, error } = useFetch({ query: useStreamSchemaQuery(workspaceId) });

  // Getting from redux to decide creating/editing
  const { editing, streamId } = useSelector((state: RootState) => state.streamFlow);

  // Getting stream selectors for editing case specifically - not useful for create case
  const { selectStreamById } = getStreamSelectors(workspaceId as string);
  const streamData = useSelector((state) => selectStreamById(state, streamId));

  let initialData = {
    id: generateUUID(),
    type: 'stream',
    workspaceId: workspaceId,
    name: null,
    domains: [],
    authorizedJavaScriptDomains: '',
    publicKeys: [],
    privateKeys: []
  };

  if (isTrue(editing)) {
    initialData = streamData;
  }

  // Mutation for creating stream
  const [createStream, { isLoading: isCreating, isSuccess: isCreated, isError: isCreateError, error: createError }] =
    useCreateStreamMutation();

  // Mutation for editing stream
  const [editStream, { isLoading: isEditing, isSuccess: isEdited, isError: isEditError, error: editError }] =
    useEditStreamMutation();

  // Mutation for deleting stream
  const [deleteStream, { isLoading: isDeleting, isSuccess: isDeleted, isError: isDeleteError, error: deleteError }] =
    useDeleteStreamMutation();

  const [data, setData] = useState<any>(initialData);

  // form state
  const [status, setStatus] = useState<FormStatus>('empty');

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  const invisibleFields = ['id', 'workspaceId', 'type'];

  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: invisibleFields });

  useEffect(() => {
    if (isCreated || isEdited || isDeleted) {
      setStatus('success');
      handleNavigationOnSuccess();
    }
  }, [isCreated, isEdited, isDeleted]);

  useEffect(() => {
    if (isCreateError || isEditError || isDeleteError) {
      setStatus('error');

      // extract errors from createError || editError || deleteError objects
      const errors = getErrorsInErrorObject(createError || editError || deleteError);

      const { message = '' } = errors || {};

      // open alert dialog
      handleAlertOpen({ message: message || deleteError, alertType: 'error' as AlertStatus });
    }
  }, [isCreateError, isEditError, isDeleteError]);

  const handleSubmit = () => {
    setStatus('submitting');
    const payload = {
      workspaceId: workspaceId,
      stream: data
    };
    if (editing) {
      editStream(payload);
    } else {
      createStream(payload);
    }
  };

  const handleDelete = () => {
    const payload = { workspaceId: workspaceId, streamId: streamId };
    deleteStream(payload);
  };

  const handleNavigationOnSuccess = () => {
    router.push(`/spaces/${workspaceId}/streams`);
  };

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
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

  const PageContent = () => {
    return (
      <ConnectorLayout title={''}>
        {/** Display Content */}
        <FormLayout
          formComp={
            <FormControlComponent
              key={`StreamFormControl`}
              deleteTooltip="Delete stream"
              editing={!!editing}
              onDelete={handleDelete}
              onFormChange={handleFormChange}
              onSubmitClick={handleSubmit}
              isDeleting={isDeleting}
              status={status}
              error={createError || editError}
              jsonFormsProps={{ data: data, schema: schema, renderers: customRenderers }}
              removeAdditionalFields={false}
            />
          }
          instructionsComp={<DestinationInstructions key={`StreamInstructions`} data={schema} type="stream" />}
        />
      </ConnectorLayout>
    );
  };

  return (
    <PageLayout
      pageHeadTitle={editing ? 'Edit Stream' : 'Create Stream'}
      title={editing ? 'Edit Stream' : 'Create a new Stream'}
      displayButtonInHeader={false}
    >
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
      />
      <ContentLayout
        key={`createStream`}
        error={error}
        PageContent={<PageContent />}
        displayComponent={!error && !isLoading && schema}
        isLoading={isLoading}
        traceError={traceError}
      />
    </PageLayout>
  );
};

CreateStream.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateStream;
