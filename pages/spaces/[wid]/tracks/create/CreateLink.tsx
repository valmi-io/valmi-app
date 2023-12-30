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
import { getDestinationSelectors, getLinkSelectors, getStreamSelectors, useCreateDestinationMutation, useCreateLinkMutation, useCreateStreamMutation, useDeleteDestinationMutation, useDeleteLinkMutation, useDeleteStreamMutation, useDestinationSchemaQuery, useEditDestinationMutation, useEditLinkMutation, useEditStreamMutation, useGetStreamsQuery, useLinkSchemaQuery, useStreamSchemaQuery } from '@store/api/streamApiSlice';
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
import FontAwesomeIcon from '../../../../../src/components/Icon/FontAwesomeIcon';
import appIcons from '../../../../../src/utils/icon-utils';
import { _ } from 'numeral';
import isEqual from 'lodash/isEqual';
import Ajv from 'ajv';

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

const jsonFormRemoveAdditionalFields = (schema: any, data: any) => {
  const ajv = new Ajv({removeAdditional: "all"})

  const validate = ajv.compile(schema);
  let xdata = {...data};
  validate(xdata);
  return xdata;
};


const CreateDestination = ({type, fromId, toId} : any) => {
  console.log("fromId2", fromId);
  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const { workspaceId = '' } = appState;

  // Getting from redux to decide creating/editing
  const {editing, id: linkId} = useSelector((state: RootState) => state.trackFlow);

  // Getting stream selectors for editing case specifically - not useful for create case
  const { selectAllLinks, selectLinkById} = getLinkSelectors(workspaceId as string);
  const linkData = useSelector((state) => selectLinkById(state, linkId));

  // Getting selectors for destinations
  const { selectAllDestinations, selectDestinationById } = getDestinationSelectors(workspaceId as string);
  const destinationData = useSelector((state) => selectDestinationById(state, toId));


  // Getting schema for the object
  const { data: schema, isLoading, isSuccess, isError, error } = useLinkSchemaQuery({workspaceId, type: type?type: destinationData.destinationType});


  // Initialise data
  let initialData = {
    fromId: fromId,
    toId: toId,
  };

  if (isTrue(editing)) {
    initialData = linkData;
  }



  const [data, setData] = useState<any>(initialData);



  // Mutation for creating Schema object
  const [createObject, { isLoading: isCreating, isSuccess: isCreated, isError: isCreateError, error: createError }] = useCreateLinkMutation();

  // Mutation for deleting Schema object
  const [deleteObject, { isLoading: isDeleting, isSuccess: isDeleted, isError: isDeleteError, error: deleteError }] = useDeleteLinkMutation();

  const PageContent = () => {
    //   const uiSchema = Generate.uiSchema(schema);
    //   uiSchema.elements[7].options = {  detail : 'REGISTERED' };
    //   console.log(uiSchema);

    const { valid, errors } = jsonFormValidator(schema, jsonFormRemoveAdditionalFields(schema,data));

    return (
      <Box margin={10}>
        {editing &&
          <IconButton onClick={()=>deleteObject({ workspaceId: workspaceId,  linkId: linkId})}>
                <FontAwesomeIcon icon={appIcons.UPLOAD} />
          </IconButton>
        }
        <JsonForms
          schema={schema}
          //uischema={uiSchema}
          data={data}
          renderers={renderers}
          cells={materialCells}
          onChange={({ errors, data }) => setData(data)}
        />
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <Button
          variant="contained"
          color="primary"
          disabled={isCreating || !valid}
          onClick={() =>
            {
              let ndata = jsonFormRemoveAdditionalFields(schema, data);
              if (editing) {
                ndata = {...ndata, id: linkId};
              }
              createObject({ workspaceId: workspaceId, link: ndata })
            }
          }
        >
          Submit{' '}
        </Button>
        <pre>{errors.length > 0 && JSON.stringify(errors, null, 2)}</pre>
        <pre>{isCreateError && JSON.stringify(createError, null, 2)}</pre>
      </Box>
    );
  };
  return (
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
  );
};

export default CreateDestination;
