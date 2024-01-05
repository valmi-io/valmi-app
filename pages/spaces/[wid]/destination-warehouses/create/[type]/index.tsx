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
  getDestinationSelectors,
  useCreateDestinationMutation,
  useDeleteDestinationMutation,
  useDestinationSchemaQuery,
  useEditDestinationMutation
} from '@store/api/streamApiSlice';
import { RootState } from '@store/reducers';
import { generateUUID, isTrue } from '@/utils/lib';
import { useFetch } from '@/hooks/useFetch';
import ContentLayout from '@/layouts/ContentLayout';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import FormLayout from '@/layouts/FormLayout';
import DestinationInstructions from '@/content/DestinationWarehouses/DestinationInstructions';
import DestinationFormControl from '@/content/DestinationWarehouses/DestinationFormControl';
import { createDestinationCustomRenderers } from '@/content/DestinationWarehouses/DestinationUtils';
import { JsonFormsCore } from '@jsonforms/core';
import { FormStatus } from '@/utils/form-utils';

const CreateDestinationXterior = () => {
  // Get type from router
  const router = useRouter();
  const { type } = router.query;
  if (!type) return <></>;
  else return <CreateDestination type={type} />;
};

const CreateDestination = ({ type }: any) => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const { workspaceId = '' } = appState;

  // Getting schema for the object
  const {
    data: schema,
    isLoading,
    traceError,
    error
  } = useFetch({ query: useDestinationSchemaQuery({ workspaceId, type }) });

  // Getting from redux to decide creating/editing
  const {
    editing,
    id: destinationId,
    type: xtype,
    supertype
  } = useSelector((state: RootState) => state.destinationFlow);

  // Getting stream selectors for editing case specifically - not useful for create case
  const { selectAllDestinations, selectDestinationById } = getDestinationSelectors(workspaceId as string);
  const destinationData = useSelector((state) => selectDestinationById(state, destinationId));

  let initialData = {
    id: generateUUID(),
    type: 'destination',
    workspaceId: workspaceId,
    name: '',
    destinationType: type //Sorry for the confusion - our type is jitsu destinationType and our supertype is jitsu type
  };

  if (isTrue(editing)) {
    initialData = destinationData;
  }

  // Mutation for creating Schema object
  const [createObject, { isLoading: isCreating, isSuccess: isCreated, isError: isCreateError, error: createError }] =
    useCreateDestinationMutation();

  // Mutation for editing Schema object
  const [editObject, { isLoading: isEditing, isSuccess: isEdited, isError: isEditError, error: editError }] =
    useEditDestinationMutation();

  // Mutation for deleting Schema object
  const [deleteObject, { isLoading: isDeleting, isSuccess: isDeleted, isError: isDeleteError, error: deleteError }] =
    useDeleteDestinationMutation();

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
      destination: data
    };

    if (editing) {
      editObject(payload);
    } else {
      createObject(payload);
    }
  };

  const handleDelete = () => {
    const payload = { workspaceId: workspaceId, destinationId: destinationId };
    deleteObject(payload);
  };

  const handleNavigationOnSuccess = () => {
    router.push(`/spaces/${workspaceId}/destination-warehouses`);
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
              key={`DestinationFormControl`}
              deleteTooltip="Delete warehouse"
              editing={!!editing}
              onDelete={handleDelete}
              onFormChange={handleFormChange}
              onSubmitClick={handleSubmit}
              isDeleting={isDeleting}
              status={status}
              error={createError || editError}
              jsonFormsProps={{ data: data, schema: schema, renderers: createDestinationCustomRenderers }}
            />
          }
          instructionsComp={<DestinationInstructions key={`DestinatonInstructions`} data={schema} type="destination" />}
        />
      </ConnectorLayout>
    );
  };

  return (
    <PageLayout
      pageHeadTitle={editing ? 'Edit Destination' : 'Create Destination'}
      title={editing ? 'Edit destination' : 'Create a new destination'}
      displayButton={false}
    >
      <ContentLayout
        key={`createDestination${type}`}
        error={error}
        PageContent={<PageContent />}
        displayComponent={!error && !isLoading && schema}
        isLoading={isLoading}
        traceError={traceError}
      />
    </PageLayout>
  );
};

CreateDestinationXterior.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateDestinationXterior;
