import React, { useContext, useState } from 'react';
import { CombinatorRendererProps, isDescriptionHidden, createCombinatorRenderInfos } from '@jsonforms/core';
import { hasAuthorizedOAuth } from '@/content/ConnectionFlow/ConnectorConfig/ConnectorConfigUtils';
import { JsonFormsDispatch, withJsonFormsOneOfProps } from '@jsonforms/react';
import { Button, Card, FormControl, FormHelperText, Hidden, Tab, Tabs, TextField } from '@mui/material';
import { merge } from 'lodash';
import { useFocus } from '@jsonforms/material-renderers';
import { OAuthContext } from '@/contexts/OAuthContext';
import FormFieldAuth from '@/components/FormInput/FormFieldAuth';

const MaterialOneOfEnumControl = (props: CombinatorRendererProps) => {
  const [focused, onFocus, onBlur] = useFocus();
  const {
    handleOAuthButtonClick,
    isConnectorConfigured,
    handleOnConfigureButtonClick,
    isConfigurationRequired,
    oAuthProvider
  } = useContext(OAuthContext);

  const {
    data,
    description,
    schema,
    uischema,
    path,
    errors,
    enabled,
    visible,
    id,
    handleChange,
    config,
    rootSchema,
    uischemas,
    renderers,
    cells
  } = props;

  const isValid = errors.length === 0;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const hasOneOfArr = !!schema?.oneOf;

  const oAuthOptions = (hasOneOfArr && schema?.oneOf) || schema || [];
  const selectedSchema = oAuthOptions[selectedIndex]?.properties || {};

  console.log('OAUTH OPTILNS :', oAuthOptions);
  console.log('selected schema :', selectedSchema);

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  const isOAuthSelected = (option: number) => {
    return !!(oAuthOptions[option].title?.toLowerCase() === 'oauth2.0');
  };

  const firstFormHelperText = showDescription ? description : !isValid ? errors : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;

  const handleTabChange = (_event: any, newOneOfIndex: number) => {
    setSelectedIndex(newOneOfIndex);
  };

  // Add this function to check if form fields are filled
  const areFieldsFilled = () => {
    // Check if any field is filled
    for (const key in selectedSchema) {
      if (selectedSchema[key]) {
        return true;
      }
    }
    return false;
  };

  const oneOfRenderInfos =
    hasOneOfArr && createCombinatorRenderInfos(oAuthOptions, rootSchema, 'oneOf', uischema, path, uischemas);

  return (
    <Hidden xsUp={!visible}>
      <Card sx={{ py: 2 }}>
        {visible && (
          <FormControl
            fullWidth={!appliedUiSchemaOptions.trim}
            onFocus={onFocus}
            onBlur={onBlur}
            id={id}
            variant={'standard'}
          >
            <Tabs value={selectedIndex} onChange={handleTabChange}>
              {hasOneOfArr &&
                oAuthOptions.map((option: any, index: number) => <Tab key={option?.title} label={option?.title} />)}
            </Tabs>
            {hasOneOfArr &&
              oAuthOptions[selectedIndex].title?.toLocaleLowerCase() !== 'oauth2.0' &&
              //@ts-ignore
              oneOfRenderInfos.map(
                (oneOfRenderInfo: any, oneOfIndex: number) =>
                  selectedIndex === oneOfIndex && (
                    <JsonFormsDispatch
                      key={oneOfIndex}
                      schema={oneOfRenderInfo.schema}
                      uischema={oneOfRenderInfo.uischema}
                      path={path}
                      renderers={renderers}
                      cells={cells}
                    />
                  )
              )}

            {hasOneOfArr
              ? isOAuthSelected(selectedIndex) && (
                  <FormFieldAuth
                    label={schema?.title}
                    onClick={handleOAuthButtonClick}
                    isConnectorConfigured={isConnectorConfigured}
                    isConfigurationRequired={isConfigurationRequired}
                    handleOnConfigureButtonClick={handleOnConfigureButtonClick}
                    oAuthProvider={'facebook'}
                    // oauth_error={oauth_error}
                    hasOAuthAuthorized={hasAuthorizedOAuth}
                  />
                )
              : isOAuthSelected(selectedIndex) && (
                  <FormFieldAuth
                    label={schema?.title}
                    onClick={handleOAuthButtonClick}
                    isConnectorConfigured={isConnectorConfigured}
                    isConfigurationRequired={isConfigurationRequired}
                    handleOnConfigureButtonClick={handleOnConfigureButtonClick}
                    oAuthProvider={'facebook'}
                    // oauth_error={oauth_error}
                    hasOAuthAuthorized={hasAuthorizedOAuth}
                  />
                )}
            <FormHelperText error={!isValid && !showDescription}>{firstFormHelperText}</FormHelperText>
            <FormHelperText error={!isValid}>{secondFormHelperText}</FormHelperText>
          </FormControl>
        )}
      </Card>
    </Hidden>
  );
};

export default withJsonFormsOneOfProps(MaterialOneOfEnumControl);
