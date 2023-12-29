/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useGetStreamsQuery, useStreamSchemaQuery } from '@store/api/streamApiSlice';
import { RootState } from '@store/reducers';
import { Box, Card, Grid } from '@mui/material';
import ErrorContainer from '../../../../../src/components/Error/ErrorContainer';
import SkeletonLoader from '../../../../../src/components/SkeletonLoader';
import ratingControlTester from '../../../../../src/tmp/ratingControlTester';
import StreamKeysControl from '../../../../../src/tmp/StreamKeysControl';
import { Generate, JsonSchema, TesterContext, UISchemaElement, rankWith } from '@jsonforms/core';
import InputControl from '../../../../../src/tmp/InputControl';
import InvisibleControl from '../../../../../src/tmp/InvisibleControl';
import { v4 as uuidv4 } from 'uuid';

const invisibleProperties = ['id', 'workspaceId', 'type'];
const invisiblePropertiesTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control')
    return false;
  return invisibleProperties.some((prop) => uischema.scope.endsWith(prop));
};


const apiKeys = ['publicKeys', 'privateKeys'];
const apiKeysTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control')
    return false;
  return apiKeys.some((prop) => uischema.scope.endsWith(prop));
};


const inputControlTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control')
    return false;
  //simple hack to get the control name. //TODO: find a better way
  const arr =  uischema.scope.split('/');
  const controlName = arr[arr.length - 1];
  // console.log(controlName);
  const dataType = schema?.properties?.[controlName]?.type;
  // console.log(dataType);

  if (dataType === 'string' || dataType === 'number')
    return true;
  return false;
};

const renderers = [
  ...materialRenderers,
  {
      tester: rankWith(
      4000, //increase rank as needed
      apiKeysTester,
    ), renderer: StreamKeysControl
  },
  {
    tester: rankWith(
      3000, //increase rank as needed
      invisiblePropertiesTester,
    ), renderer: InvisibleControl
  },
  {
    tester: rankWith(
      2000, //increase rank as needed
      inputControlTester,
    ), renderer: InputControl
  },
];



const CreateStream = () => {

  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const { workspaceId = '' } = appState;

  const initialData = {id: uuidv4(), type: 'stream', workspaceId: workspaceId, name: 'bond', domains: [], authorizedJavaScriptDomains: '', publicKeys: [], privateKeys: []};

  const [data, setData] = useState<any>(initialData);


  const {
    data: schema,
    isLoading,
    isSuccess,
    isError,
    error
  } = useStreamSchemaQuery(workspaceId);


  const PageContent = () => {
    //   const uiSchema = Generate.uiSchema(schema);
    //   uiSchema.elements[7].options = {  detail : 'REGISTERED' };
    //   console.log(uiSchema);

    return <Box margin={10}>
            <JsonForms
              schema={schema}
              //uischema={uiSchema}
              data={data}
              renderers={renderers}
              cells={materialCells}
              onChange={({ errors, data }) => setData(data)}
            />
            <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>;
  }
  return (
    <PageLayout
      pageHeadTitle={'Create stream'}
      title={'Create a new stream'}
      displayButton={false}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
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
