// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 26th 2023, 12:12:53 pm
 * Author: Nagendra S @ valmi.io
 */

import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import { styled } from '@mui/material';

import { getOAuthParams } from 'pages/auth/callback';

import ConnectorLayout from '@layouts/ConnectorLayout';

import ConnectorFormFields from '@content/ConnectionFlow/ConnectorConfig/ConnectorFormFields';
import {
  getConnectorDocumentationUrl,
  getOauthRoute,
  hasAuthorizedOAuth,
  processFields
} from '@content/ConnectionFlow/ConnectorConfig/ConnectorConfigUtils';

import SkeletonLoader from '@components/SkeletonLoader';
import { getErrorsInData, hasErrorsInData } from '@components/Error/ErrorUtils';
import ErrorComponent, { ErrorStatusText } from '@components/Error';
import Instructions from '@components/Instructions';

import { generateConfigFromSpec } from '@utils/connection-utils';

import { AppDispatch } from '@store/store';
import { setConnectionFlow } from '@store/reducers/connectionFlow';
import { useLazyFetchConnectorSpecQuery } from '@store/api/apiSlice';
import { RootState } from '@store/reducers';
import FormLayout from '@/layouts/FormLayout';

const Form = styled(Box)(({}) => ({
  display: 'flex',
  width: '50%'
}));
interface ConnectorConfigProps {
  control: any;
  handleSubmit: any;
  formValues: any;
  resetForm: any;
  setValue: any;
  onSubmit: (formData: any) => void;
}

const ConnectorConfig = ({
  control,
  formValues,
  resetForm,
  handleSubmit,
  setValue,
  onSubmit
}: ConnectorConfigProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const connection_flow = useSelector((state: RootState) => state.connectionFlow);

  const {
    flowState: {
      selected_connector = null,
      selected_file = null,
      oauth_params = {},
      oauth_error = '',
      connector_spec = null,
      connector_config = null,
      connection_title = ''
    } = {}
  } = connection_flow;

  const fileInputRef = useRef(null);

  const [traceError, setTraceError] = useState<any>(null);

  {
    /* query for connector configuration */
  }
  const [fetchConnectorConfig, { data, isFetching, isError, error }] = useLazyFetchConnectorSpecQuery();

  useEffect(() => {
    if (selected_connector) {
      // reset form if no connector_config in connection_flow
      if (!connector_config) {
        resetForm({});
      } else {
        resetForm((formValues) => ({
          ...formValues,
          ...connector_config,
          title: connection_title
        }));
      }
      fetchConnectorConfig({
        type: selected_connector.type,
        workspaceId: workspaceId
      });
    }
  }, []);

  useEffect(() => {
    if (data) {
      if (hasErrorsInData(data)) {
        const traceError = getErrorsInData(data);
        setTraceError(traceError);
      } else {
        // saving connector spec in store
        dispatch(
          setConnectionFlow({
            ...connection_flow.flowState,
            connector_spec: data
            //connector_spec: mockJson
          })
        );
      }
    }
  }, [data]);

  const handleOAuthButtonClick = (data) => {
    const values = formValues;
    let combinedValues = { ...values, ...getOAuthParams(oauth_params) };

    let config = generateConfigFromSpec(connector_spec, combinedValues);
    dispatch(
      setConnectionFlow({
        ...connection_flow.flowState,
        connector_config: config,
        connection_title: values.title
      })
    );

    if (data.oAuthProvider) {
      // getOauthRoute -> returns /api/login/facebook which is defined in pages/api
      const oAuthRoute = getOauthRoute({ oAuth: data.oAuthProvider });
      if (oAuthRoute) {
        router.push(oAuthRoute);
      }
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent: string = event.target.result as string;
      const jsonData = JSON.parse(fileContent);
      const values = formValues;

      let combinedValues = { ...values, ...getOAuthParams(oauth_params) };

      let config = generateConfigFromSpec(connector_spec, combinedValues);

      let selectedFile = {
        name: file.name ? file.name : '',
        fileData: jsonData
      };

      // updating the value of credentials manually in form object.
      setValue('credentials', file.name, { shouldValidate: true });

      // store selected file in connection_flow state
      dispatch(
        setConnectionFlow({
          ...connection_flow.flowState,
          connector_config: config,
          connection_title: values.title,
          selected_file: selectedFile
        })
      );
    };

    reader.readAsText(file);
  };

  const FormFields = ({ data }) => {
    const fields = data ? processFields(data) : [];

    return (
      <Form>
        <ConnectorFormFields
          fields={fields}
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          hasAuthorizedOAuth={hasAuthorizedOAuth(oauth_params)}
          oauth_error={oauth_error}
          selectedConnector={selected_connector ? selected_connector.display_name : ''}
          selected_file={selected_file ? selected_file?.name : ''}
          fileInputRef={fileInputRef}
          handleUploadButtonClick={handleUploadButtonClick}
          handleFileChange={handleFileChange}
          handleOAuthButtonClick={handleOAuthButtonClick}
        />
      </Form>
    );
  };

  const InstructionsContent = (data) => {
    const connectorDocumentationUrl = data ? getConnectorDocumentationUrl(data) : '';
    const title = 'Connector Documentation';
    const linkText = selected_connector ? selected_connector.display_name : '';
    return (
      <Instructions
        documentationUrl={connectorDocumentationUrl}
        title={title}
        linkText={linkText}
        type={'connection'}
      />
    );
  };

  return (
    <ConnectorLayout title={`Connect to ${selected_connector ? selected_connector.display_name : 'connector'}`}>
      {/** Display Errors */}
      {isError && <ErrorComponent error={error} />}

      {/** Display Trace Error */}
      {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

      {/** Display Skeleton */}
      <SkeletonLoader loading={isFetching} />

      {/** Display Content */}
      {!isFetching && data && (
        <FormLayout formFields={<FormFields data={data} />} instructions={<InstructionsContent />} />
        // <Layout>
        //   {/* display fields */}
        //   {displayFields(data)}
        //   <Divider sx={{ m: 0.5 }} orientation="vertical" />
        //   {/* Display Instructions content */}
        //   <Box
        //     sx={{
        //       width: '40%'
        //     }}
        //   >
        //     {displayInstructions(data)}
        //   </Box>
        // </Layout>
      )}
    </ConnectorLayout>
  );
};

export default ConnectorConfig;
