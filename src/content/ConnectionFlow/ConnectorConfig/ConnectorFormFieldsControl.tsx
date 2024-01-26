/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 5th 2024, 9:51:20 am
 * Author: Nagendra S @ valmi.io
 */

import {
  processFields,
  getOauthRoute,
  hasAuthorizedOAuth
} from '@/content/ConnectionFlow/ConnectorConfig/ConnectorConfigUtils';
import ConnectorFormFields from '@/content/ConnectionFlow/ConnectorConfig/ConnectorFormFields';
import { FormContainer } from '@/layouts/FormLayout';
import { getOAuthParams } from '@/pagesauth/callback';
import { RootState } from '@/store/reducers';
import { setConnectionFlow } from '@/store/reducers/connectionFlow';
import { generateConfigFromSpec } from '@/utils/connection-utils';
import { useRouter } from 'next/router';
import { ChangeEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ConnectorFormFieldsControl = (props: any) => {
  const { data, control, handleSubmit, onSubmit, formValues, resetForm, setValue } = props;

  const dispatch = useDispatch();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const connection_flow = useSelector((state: RootState) => state.connectionFlow);

  const {
    flowState: {
      selected_connector = null,
      selected_file = null,
      oauth_params = {},
      oauth_error = '',
      connector_spec = null
    } = {}
  } = connection_flow;
  const fields = data ? processFields(data) : [];

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      //@ts-ignore
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      //@ts-ignore
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

  const handleOAuthButtonClick = (data: any) => {
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

  return (
    <FormContainer>
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
    </FormContainer>
  );
};

export default ConnectorFormFieldsControl;
