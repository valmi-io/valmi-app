import React, { ReactElement, useEffect, useState } from 'react';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  getAnalyticsDestinationSelectors,
  useCreateAnalyticsDestinationMutation,
  useDeleteDestinationMutation,
  useAnalyticsDestinationsSchemaQuery,
  useEditDestinationMutation
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
  } = useFetch({ query: useAnalyticsDestinationsSchemaQuery({ workspaceId, type }) });

  // Getting from redux to decide creating/editing
  const {
    editing,
    id: destinationId,
    type: xtype,
    supertype
  } = useSelector((state: RootState) => state.destinationFlow);

  // Getting stream selectors for editing case specifically - not useful for create case
  const { selectAllAnalyticsDestinations, selectAnalyticsDestinationById } = getAnalyticsDestinationSelectors(workspaceId as string);
  const analyticsDestinationData = useSelector((state) => selectAnalyticsDestinationById(state, destinationId));

  let initialData = {
    id: generateUUID(),
    type: 'destination',
    workspaceId: workspaceId,
    name: undefined,
    destinationType: type //Sorry for the confusion - our type is jitsu destinationType and our supertype is jitsu type
  };

  if (isTrue(editing)) {
    initialData = analyticsDestinationData;
  }

  // Mutation for creating Schema object
  const [createObject, { isLoading: isCreating, isSuccess: isCreated, isError: isCreateError, error: createError }] =
    useCreateAnalyticsDestinationMutation();

  // Mutation for editing Schema object
  const [editObject, { isLoading: isEditing, isSuccess: isEdited, isError: isEditError, error: editError }] =
    useEditDestinationMutation();

  // Mutation for deleting Schema object
  const [deleteObject, { isLoading: isDeleting, isSuccess: isDeleted, isError: isDeleteError, error: deleteError }] =
    useDeleteDestinationMutation();

  const [data, setData] = useState<any>(initialData);

  // form state
  const [status, setStatus] = useState<FormStatus>('empty');

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  const invisibleFields = ['id', 'workspaceId', 'type', 'provisioned', 'testConnectionError', 'destinationType'];

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

      // extract errors from createError || deleteError object
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
              key={`DestinationFormControl`}
              deleteTooltip="Delete warehouse"
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
          instructionsComp={
            <DestinationInstructions
              key={`AnalyticsDestinatonInstructions`}
              destinationType={type}
              data={schema}
              type="destination"
            />
          }
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
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
      />
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
