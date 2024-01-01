/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  getStreamSelectors,
  useCreateStreamMutation,
  useDeleteStreamMutation,
  useEditStreamMutation,
  useGetStreamsQuery,
  useStreamSchemaQuery
} from '@store/api/streamApiSlice';
import { RootState } from '@store/reducers';
import { Box, Button, Card, Grid, IconButton } from '@mui/material';
import ErrorContainer from '@components/Error/ErrorContainer';
import SkeletonLoader from '@components/SkeletonLoader';
import ratingControlTester from '../../../../../src/tmp/ratingControlTester';
import StreamKeysControl from '../../../../../src/tmp/StreamKeysControl';
import { Generate, JsonSchema, TesterContext, UISchemaElement, createAjv, rankWith } from '@jsonforms/core';
import InputControl from '../../../../../src/tmp/InputControl';
import InvisibleControl from '../../../../../src/tmp/InvisibleControl';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'next/navigation';
import { isTrue } from '../../../../../src/utils/lib';
import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage';
import FontAwesomeIcon from '../../../../../src/components/Icon/FontAwesomeIcon';
import appIcons from '../../../../../src/utils/icon-utils';
import SubmitButton from '../../../../../src/components/SubmitButton';

const invisibleProperties = ['id', 'workspaceId', 'type'];
const invisiblePropertiesTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control') return false;
  return invisibleProperties.some((prop) => uischema.scope.endsWith(prop));
};

const apiKeys = ['publicKeys', 'privateKeys'];
const apiKeysTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control') return false;
  return apiKeys.some((prop) => uischema.scope.endsWith(prop));
};

const inputControlTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control') return false;
  //simple hack to get the control name. //TODO: find a better way
  const arr = uischema.scope.split('/');
  const controlName = arr[arr.length - 1];
  // console.log(controlName);
  const dataType = schema?.properties?.[controlName]?.type;
  // console.log(dataType);

  if (dataType === 'string' || dataType === 'number') return true;
  return false;
};

const renderers = [
  ...materialRenderers,
  {
    tester: rankWith(
      4000, //increase rank as needed
      apiKeysTester
    ),
    renderer: StreamKeysControl
  },
  {
    tester: rankWith(
      3000, //increase rank as needed
      invisiblePropertiesTester
    ),
    renderer: InvisibleControl
  },
  {
    tester: rankWith(
      2000, //increase rank as needed
      inputControlTester
    ),
    renderer: InputControl
  }
];

const jsonFormValidator = (schema: any, data: any) => {
  const ajv = createAjv({ useDefaults: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    return {
      valid: false,
      errors: (validate as any).errors.map((error: any) => {
        return {
          message: error.message,
          path: error.dataPath
        };
      })
    };
  }
  return { valid: true, errors: [] };
};

const CreateStream = () => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const { workspaceId = '' } = appState;

  // Getting schema for the object
  const { data: schema, isLoading, isSuccess, isError, error } = useStreamSchemaQuery(workspaceId);

  // Getting from redux to decide creating/editing
  const { editing, streamId } = useSelector((state: RootState) => state.streamFlow);

  // Getting stream selectors for editing case specifically - not useful for create case
  const { selectStreamById } = getStreamSelectors(workspaceId as string);
  const streamData = useSelector((state) => selectStreamById(state, streamId));

  let initialData = {
    id: uuidv4(),
    type: 'stream',
    workspaceId: workspaceId,
    name: 'bond',
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
  const [createStream, { data: createStreamData, isLoading: isCreating, isSuccess: isCreated, isError: isCreateError, error: createError }] =
    useCreateStreamMutation();

  // Mutation for editing stream
  const [editStream, { data: editStreamData, isLoading: isEditing, isSuccess: isEdited, isError: isEditError, error: editError }] = useEditStreamMutation();

  // Mutation for deleting stream
  const [deleteStream, { isLoading: isDeleting, isSuccess: isDeleted, isError: isDeleteError, error: deleteError }] = useDeleteStreamMutation();

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

  const PageContent = () => {
    const { valid, errors } = jsonFormValidator(schema, data);

    return (
      <Box margin={10}>
        {editing && (
          <IconButton onClick={handleDeleteStream}>
            <FontAwesomeIcon icon={appIcons.DELETE} />
          </IconButton>
        )}
        <JsonForms
          schema={schema}
          //uischema={uiSchema}
          data={data}
          renderers={renderers}
          cells={materialCells}
          onChange={({ errors, data }) => setData(data)}
        />
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <SubmitButton
          buttonText={'Submit'}
          data={createStreamData || editStreamData}
          isFetching={isCreating || isEditing}
          disabled={!valid}
          onClick={handleButtonOnClick}
        />

        <pre>{errors.length > 0 && JSON.stringify(errors, null, 2)}</pre>
        <pre>{isCreateError && JSON.stringify(createError, null, 2)}</pre>
      </Box>
    );
  };

  return (
    <PageLayout pageHeadTitle={editing ? 'Edit Stream' : 'Create Stream'} title={editing ? 'Edit Stream' : 'Create a new Stream'} displayButton={false}>
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined">
            {/** Display error */}
            {isError && <ErrorContainer error={error} />}

            {/** Display trace error
              {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}*/}

            {/** Display skeleton */}
            <SkeletonLoader loading={isLoading} />

            {/** Display page content */}
            {!error && !isLoading && schema && <PageContent />}
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

CreateStream.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateStream;
