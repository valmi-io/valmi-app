/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';

import { useSelector } from 'react-redux';
import {
  getDestinationSelectors,
  getLinkSelectors,
  useCreateLinkMutation,
  useDeleteLinkMutation,
  useLinkSchemaQuery
} from '@store/api/streamApiSlice';
import { RootState } from '@store/reducers';
import { Box, Button, Card, Grid, IconButton } from '@mui/material';
import ErrorContainer from '@components/Error/ErrorContainer';
import SkeletonLoader from '@components/SkeletonLoader';
import { JsonSchema, TesterContext, createAjv, rankWith } from '@jsonforms/core';
import InputControl from '../../../tmp/InputControl';
import InvisibleControl from '../../../tmp/InvisibleControl';
import { isTrue } from '@utils/lib';
import CustomIcon from '@components/Icon/CustomIcon';
import appIcons from '@utils/icon-utils';
import { _ } from 'numeral';
import Ajv from 'ajv';
import { useRouter } from 'next/router';
import SubmitButton from '../../../components/SubmitButton';
import { jsonFormValidator } from '@/utils/form-utils';

const invisibleProperties = ['fromId', 'toId', 'functions', 'batchSize'];
const invisiblePropertiesTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control') return false;
  return invisibleProperties.some((prop) => uischema.scope.endsWith(prop));
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

const jsonFormRemoveAdditionalFields = (schema: any, data: any) => {
  const ajv = new Ajv({ removeAdditional: 'all' });

  const validate = ajv.compile(schema);
  let xdata = { ...data };
  validate(xdata);
  return xdata;
};

const CreateTrack = ({ type, fromId, toId }: any) => {
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
    isSuccess,
    isError,
    error
  } = useLinkSchemaQuery({ workspaceId, type: type ? type : destinationData.destinationType });

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
  const [
    createObject,
    { data: createObjectData, isLoading: isCreating, isSuccess: isCreated, isError: isCreateError, error: createError }
  ] = useCreateLinkMutation();

  // Mutation for deleting Schema object
  const [
    deleteObject,
    { data: deleteObjectData, isLoading: isDeleting, isSuccess: isDeleted, isError: isDeleteError, error: deleteError }
  ] = useDeleteLinkMutation();

  useEffect(() => {
    if (isCreated || isDeleted) {
      handleNavigationOnSuccess();
    }
  }, [isCreated, isDeleted]);

  const handleButtonOnClick = () => {
    let ndata = jsonFormRemoveAdditionalFields(schema, data);
    if (editing) {
      ndata = { ...ndata, id: linkId };
    }
    const payload = { workspaceId: workspaceId, link: ndata };
    createObject(payload);
  };

  const handleDeleteStream = () => {
    const payload = { workspaceId: workspaceId, linkId: linkId, fromId: fromId, toId: toId };
    deleteObject(payload);
  };

  const handleNavigationOnSuccess = () => {
    router.back();
  };

  const PageContent = () => {
    const { valid, errors } = jsonFormValidator(schema, jsonFormRemoveAdditionalFields(schema, data));

    return (
      <Box margin={1}>
        {editing && (
          <IconButton onClick={handleDeleteStream}>
            <CustomIcon icon={appIcons.DELETE} />
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
          data={createObjectData || deleteObjectData}
          isFetching={isCreating}
          disabled={!valid}
          onClick={handleButtonOnClick}
        />

        <pre>{errors.length > 0 && JSON.stringify(errors, null, 2)}</pre>
        <pre>{isCreateError && JSON.stringify(createError, null, 2)}</pre>
      </Box>
    );
  };

  return (
    <Card>
      {/** Display error */}
      {isError && <ErrorContainer error={error} />}

      {/** Display trace error
        {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}*/}

      {/** Display skeleton */}
      <SkeletonLoader loading={isLoading} />

      {/** Display page content */}
      {!error && !isLoading && schema && <PageContent />}
    </Card>
  );
};

export default CreateTrack;
