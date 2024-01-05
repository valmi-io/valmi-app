/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
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
import { createStreamCustomRenderers } from '@/content/Streams/StreamsUtils';
import ContentLayout from '@/layouts/ContentLayout';
import ConnectorLayout from '@/layouts/ConnectorLayout';

import FormLayout from '@/layouts/FormLayout';
import DestinationFormControl from '@/content/DestinationWarehouses/DestinationFormControl';
import DestinationInstructions from '@/content/DestinationWarehouses/DestinationInstructions';
import { JsonFormsCore } from '@jsonforms/core';
import { FormStatus } from '@/utils/form-utils';

const CreateStream = () => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const { workspaceId = '' } = appState;

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
    name: '',
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

  const [status, setStatus] = useState<FormStatus>('empty');

  useEffect(() => {
    if (isCreated || isEdited || isDeleted) {
      setStatus('success');
      handleNavigationOnSuccess();
    }
  }, [isCreated, isEdited, isDeleted]);

  useEffect(() => {
    if (isCreateError || isEditError) {
      setStatus('error');
    }
  }, [isCreateError, isEditError]);

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
    router.back();
  };

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
  };

  const PageContent = () => {
    return (
      <ConnectorLayout title={''} layoutStyles={{ marginTop: 0 }}>
        {/** Display Content */}
        <FormLayout
          formComp={
            <DestinationFormControl
              key={`StreamFormControl`}
              deleteTooltip="Delete stream"
              editing={!!editing}
              onDelete={handleDelete}
              onFormChange={handleFormChange}
              onSubmitClick={handleSubmit}
              isDeleting={isDeleting}
              status={status}
              error={createError || editError}
              jsonFormsProps={{ data: data, schema: schema, renderers: createStreamCustomRenderers }}
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
      displayButton={false}
    >
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
