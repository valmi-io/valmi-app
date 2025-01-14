// @ts-nocheck
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  CombinatorRendererProps,
  isDescriptionHidden,
  createCombinatorRenderInfos,
  createDefaultValue
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsOneOfProps } from '@jsonforms/react';
import { Card, FormControl, FormHelperText, Hidden, Tab, Tabs } from '@mui/material';
import { merge } from 'lodash';
import { useFocus } from '@jsonforms/material-renderers';
import { OAuthContext } from '@/contexts/OAuthContext';
import { TabSwitchConfirmDialog } from '@/components/FormInput/TabSwitchConfirmDialog';
import { isObjectEmpty } from '@/utils/lib';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import {
  getCredentialObjKey,
  getExtrasObjKey,
  getOAuthMethodKeyFromType,
  getSelectedConnectorKey,
  getShopifyIntegrationType,
  isIntegrationAuthorized,
  isIntegrationConfigured,
  isOAuthConfigurationRequired
} from '@/utils/connectionFlowUtils';
import { AppDispatch } from '@/store/store';
import { setEntities } from '@/store/reducers/connectionDataFlow';
import ConnectionLoginButton from '@/content/ConnectionFlow/ConnectionConfig/ConnectionLoginButton';

const MaterialOneOfEnumControl = (props: CombinatorRendererProps) => {
  const [focused, onFocus, onBlur] = useFocus();
  const { handleOAuthButtonClick, handleOnConfigureButtonClick, setFormState, formState } = useContext(OAuthContext);

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

  const dispatch = useDispatch<AppDispatch>();

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const entitiesInStore = connectionDataFlow?.entities ?? {};

  const extras = connectionDataFlow.entities[getExtrasObjKey()] ?? {};

  const isEditableFlow = !!(!isObjectEmpty(extras) && extras?.isEditableFlow);

  const { type = '', oauth_keys: oauthKeys = '', oauth_error = '', oauth_params = null } = selectedConnector;

  const {
    oauthCredentials = {},
    config: credentialConfig = {},
    account = {}
  } = connectionDataFlow.entities[getCredentialObjKey(type)] ?? {};

  const { id: credentialId = '' } = credentialConfig ?? {};

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [newSelectedIndex, setNewSelectedIndex] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const hasOneOfArr = !!schema?.oneOf;

  const oAuthOptions: any = (hasOneOfArr && schema?.oneOf) || schema || [];

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  useEffect(() => {
    if (isEditableFlow) {
      const authMethodKey = getOAuthMethodKeyFromType(type);

      const selectedAuthMethod = credentialConfig?.credentials?.[authMethodKey] ?? '';

      oAuthOptions.forEach((option: any, index: number) => {
        if (selectedAuthMethod === option?.properties?.[authMethodKey].const ?? '') {
          setSelectedIndex(index);
        }
      });
    }
  }, [isEditableFlow]);

  //if oauth_params exists then set the index of tabbed to oauth after redirecting back
  useEffect(() => {
    if (oauth_params && !isObjectEmpty(oauth_params)) {
      oAuthOptions.forEach((option: any, index: number) => {
        if (option?.title?.toLowerCase() === 'oauth2.0') {
          setSelectedIndex(index);
        }
      });
    }
  }, [oauth_params]);

  const handleClose = useCallback(() => setConfirmDialogOpen(false), [setConfirmDialogOpen]);

  const cancel = useCallback(() => {
    setConfirmDialogOpen(false);
  }, [setConfirmDialogOpen]);

  const oneOfRenderInfos = hasOneOfArr
    ? createCombinatorRenderInfos(oAuthOptions, rootSchema, 'oneOf', uischema, path, uischemas)
    : [];

  const openNewTab = (newIndex: number) => {
    handleChange(path, createDefaultValue(oneOfRenderInfos[newIndex].schema, rootSchema));
    setSelectedIndex(newIndex);
  };

  const getOAuthProviderName = (selectedConnector: object) => {
    return selectedConnector?.type?.split('_')[1]?.split('-')[0].toLowerCase();
  };

  const confirm = useCallback(() => {
    const authMethodKey = getOAuthMethodKeyFromType(type);
    const authMethodValue = !!(oAuthOptions[newSelectedIndex].title?.toLowerCase() === 'oauth2.0')
      ? 'oauth2.0'
      : oAuthOptions[newSelectedIndex]?.properties?.[authMethodKey]?.const;

    // Updating authMethod in formState
    setFormState((formState) => ({
      ...formState,
      credentials: {
        [authMethodKey]: authMethodValue
      }
    }));

    // Remove oAuthparams in redux store
    const obj = {
      ...entitiesInStore,
      [getSelectedConnectorKey()]: {
        ...connectionDataFlow.entities[getSelectedConnectorKey()],
        oauth_params: null
      }
    };

    dispatch(setEntities(obj));

    // Close the confirm dialog
    setConfirmDialogOpen(false);

    // open new tab
    openNewTab(newSelectedIndex);
  }, [handleChange, createDefaultValue, newSelectedIndex]);

  const handleTabChange = useCallback(
    (_event: any, newOneOfIndex: number) => {
      setNewSelectedIndex(newOneOfIndex);

      setConfirmDialogOpen(true);
    },
    [setConfirmDialogOpen, setSelectedIndex, data]
  );

  const renderOAuthButton = () => {
    return (
      <ConnectionLoginButton
        onClick={handleOAuthButtonClick}
        isConfigurationRequired={isOAuthConfigurationRequired(oauthKeys)}
        isConnectorConfigured={isIntegrationConfigured(oauthCredentials, type)}
        handleOnConfigureButtonClick={handleOnConfigureButtonClick}
        oAuthProvider={getOAuthProviderName(selectedConnector)}
        oauth_error={oauth_error}
        hasOAuthAuthorized={isIntegrationAuthorized(oauth_params, isEditableFlow)}
        sx={{ mt: 2 }}
      />
    );
  };

  const isOAuthSelected = (option: number) => {
    return !!(oAuthOptions[option].title?.toLowerCase() === 'oauth2.0');
  };

  const secondFormHelperText = showDescription && !isValid ? errors : null;

  return (
    <Hidden xsUp={!visible}>
      <Card>
        {visible && (
          <FormControl
            fullWidth={!appliedUiSchemaOptions.trim}
            onFocus={onFocus}
            onBlur={onBlur}
            id={id}
            variant={'standard'}
          >
            <Tabs indicatorColor="secondary" textColor="secondary" value={selectedIndex} onChange={handleTabChange}>
              {hasOneOfArr &&
                oneOfRenderInfos.map((option: any, index: number) => <Tab key={option?.label} label={option?.label} />)}
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

            {hasOneOfArr && isOAuthSelected(selectedIndex) && renderOAuthButton()}

            {!hasOneOfArr && renderOAuthButton()}

            <TabSwitchConfirmDialog
              cancel={cancel}
              confirm={confirm}
              id={'oneOf-' + id}
              open={confirmDialogOpen}
              handleClose={handleClose}
            />
            <FormHelperText error={!isValid}>{secondFormHelperText}</FormHelperText>
          </FormControl>
        )}
      </Card>
    </Hidden>
  );
};

export default withJsonFormsOneOfProps(MaterialOneOfEnumControl);
