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
  getStreamSelectors,
  useCreateStreamMutation,
  useDeleteStreamMutation,
  useEditStreamMutation,
  useStreamSchemaQuery
} from '@store/api/streamApiSlice';
import { RootState } from '@store/reducers';
import { Box, IconButton, Tooltip } from '@mui/material';
import CustomIcon from '@/components/Icon/CustomIcon';
import SubmitButton from '@/components/SubmitButton';
import appIcons from '@/utils/icon-utils';
import { generateUUID, isTrue } from '@/utils/lib';
import { jsonFormValidator } from '@/utils/form-utils';
import { useFetch } from '@/hooks/useFetch';
import { createStreamCustomRenderers } from '@/content/Streams/StreamsUtils';
import ContentLayout from '@/layouts/ContentLayout';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import Instructions from '@/components/Instructions';
import FormLayout, { FormContainer } from '@/layouts/FormLayout';

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

  const [data, setData] = useState<any>(initialData);

  // Mutation for creating stream
  const [
    createStream,
    { data: createStreamData, isLoading: isCreating, isSuccess: isCreated, isError: isCreateError, error: createError }
  ] = useCreateStreamMutation();

  // Mutation for editing stream
  const [
    editStream,
    { data: editStreamData, isLoading: isEditing, isSuccess: isEdited, isError: isEditError, error: editError }
  ] = useEditStreamMutation();

  // Mutation for deleting stream
  const [deleteStream, { isLoading: isDeleting, isSuccess: isDeleted, isError: isDeleteError, error: deleteError }] =
    useDeleteStreamMutation();

  useEffect(() => {
    if (isCreated || isEdited || isDeleted) {
      handleNavigationOnSuccess();
    }
  }, [isCreated, isEdited, isDeleted]);

  const handleButtonOnClick = () => {
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

  const handleDeleteStream = () => {
    const payload = { workspaceId: workspaceId, streamId: streamId };
    deleteStream(payload);
  };

  const handleNavigationOnSuccess = () => {
    router.back();
  };

  const FormFields = () => {
    const { valid, errors } = jsonFormValidator(schema, data);

    return (
      <FormContainer>
        {editing && (
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Tooltip title={'Delete stream'}>
              <IconButton disabled={isDeleting} onClick={handleDeleteStream}>
                <CustomIcon icon={appIcons.DELETE} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        <JsonForms
          schema={schema}
          data={data}
          renderers={createStreamCustomRenderers}
          cells={materialCells}
          onChange={({ errors, data }) => {
            setData(data);
          }}
        />
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <SubmitButton
            buttonText={'Submit'}
            data={createStreamData || editStreamData}
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
    const title = 'Streams';
    const linkText = 'streams.';

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
