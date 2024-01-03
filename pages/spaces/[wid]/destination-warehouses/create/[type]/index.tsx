/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells } from '@jsonforms/material-renderers';

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
import { Box, IconButton, Tooltip } from '@mui/material';
import CustomIcon from '@/components/Icon/CustomIcon';
import SubmitButton from '@/components/SubmitButton';
import appIcons from '@/utils/icon-utils';
import { generateUUID, isTrue } from '@/utils/lib';
import { jsonFormValidator } from '@/utils/form-utils';
import { createDestinationCustomRenderers } from '@/content/DestinationWarehouses/DestinationUtils';
import { useFetch } from '@/hooks/useFetch';
import ContentLayout from '@/layouts/ContentLayout';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import Instructions from '@/components/Instructions';
import FormLayout, { FormContainer } from '@/layouts/FormLayout';

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

  const [data, setData] = useState<any>(initialData);

  // Mutation for creating Schema object
  const [
    createObject,
    { data: createObjectData, isLoading: isCreating, isSuccess: isCreated, isError: isCreateError, error: createError }
  ] = useCreateDestinationMutation();

  // Mutation for editing Schema object
  const [
    editObject,
    { data: editObjectData, isLoading: isEditing, isSuccess: isEdited, isError: isEditError, error: editError }
  ] = useEditDestinationMutation();

  // Mutation for deleting Schema object
  const [deleteObject, { isLoading: isDeleting, isSuccess: isDeleted, isError: isDeleteError, error: deleteError }] =
    useDeleteDestinationMutation();

  useEffect(() => {
    if (isCreated || isEdited || isDeleted) {
      handleNavigationOnSuccess();
    }
  }, [isCreated, isEdited, isDeleted]);

  const handleButtonOnClick = () => {
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

  const handleDeleteStream = () => {
    const payload = { workspaceId: workspaceId, destinationId: destinationId };
    deleteObject(payload);
  };

  const handleNavigationOnSuccess = () => {
    router.push(`/spaces/${workspaceId}/destination-warehouses`);
  };

  const FormFields = () => {
    const { valid, errors } = jsonFormValidator(schema, data);
    return (
      <FormContainer>
        {editing && (
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Tooltip title={'Delete warehouse'}>
              <IconButton disabled={isDeleting} onClick={handleDeleteStream}>
                <CustomIcon icon={appIcons.DELETE} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        <JsonForms
          schema={schema}
          data={data}
          renderers={createDestinationCustomRenderers}
          cells={materialCells}
          onChange={({ errors, data }) => setData(data)}
        />
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <SubmitButton
            buttonText={'Submit'}
            data={createObjectData || editObjectData}
            isFetching={isCreating || isEditing}
            disabled={!valid}
            onClick={handleButtonOnClick}
          />
        </Box>

        <pre>{errors.length > 0 && JSON.stringify(errors, null, 2)}</pre>
        <pre>{isCreateError && JSON.stringify(createError, null, 2)}</pre>
      </FormContainer>
    );
  };

  const InstructionsContent = () => {
    const documentationUrl = 'https://www.valmi.io/docs/overview';
    const title = 'Destination warehouses';
    const linkText = 'Destination-warehouses';

    return <Instructions documentationUrl={documentationUrl} title={title} linkText={linkText} type={'sync'} />;
  };

  const PageContent = () => {
    return (
      <ConnectorLayout title={''} layoutStyles={{ marginTop: 0 }}>
        {/** Display Content */}
        <FormLayout formFields={<FormFields />} instructions={<InstructionsContent />} />
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
