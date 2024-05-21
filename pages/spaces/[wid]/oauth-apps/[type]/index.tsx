/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 23rd 2024, 1:49:02 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useEffect, useState } from 'react';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { useRouter } from 'next/router';
import { useFetch } from '@/hooks/useFetch';
import ContentLayout from '@/layouts/ContentLayout';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import FormLayout from '@/layouts/FormLayout';
import { JsonFormsCore } from '@jsonforms/core';
import { FormStatus } from '@/utils/form-utils';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import { getErrorsInErrorObject } from '@/components/Error/ErrorUtils';
import FormControlComponent from '@/components/FormControlComponent';
import {
  useCreateOAuthConfigMutation,
  useEditOAuthConfigMutation,
  useGetOAuthApiConfigQuery,
  useOAuthSchemaQuery
} from '@/store/api/oauthApiSlice';
import OAuthInstructions from '@/content/OAuthApps/OAuthInstructions';
import { TData } from '@/utils/typings.d';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const CreateOAuthConfigurationLayout = () => {
  // Get type from router
  const router = useRouter();
  const { type, connector = '' } = router.query;

  if (!type && !connector) return <></>;
  else return <CreateOAuthConfiguration type={type} connector={connector} />;
};

const processData = (keys: TData) => {
  const { ids = [], entities = {} } = keys;

  if (ids.length > 0) {
    const key = ids[0];

    const { oauth_config = {} } = entities[key];

    return oauth_config;
  }
  return {};
};

const CreateOAuthConfiguration = ({ type = '', connector = '' }: any) => {
  let connectorType = connector.toUpperCase() + '_' + type.toUpperCase();

  const router = useRouter();

  const { workspaceId = null } = useWorkspaceId();

  // Getting schema for the object
  const {
    data: schema,
    isLoading,
    traceError,
    error
  } = useFetch({ query: useOAuthSchemaQuery({ type: connectorType }) });

  // Getting keys for the object
  const {
    data: keys,
    isLoading: isKeysLoading,
    traceError: isKeysTraceError,
    error: keysError
  } = useFetch({ query: useGetOAuthApiConfigQuery({ workspaceId, type: connectorType }) });

  let initialData = {};

  // Mutation for creating Schema object
  const [createObject, { isLoading: isCreating, isSuccess: isCreated, isError: isCreateError, error: createError }] =
    useCreateOAuthConfigMutation();

  // Mutation for editing Schema object
  const [editObject, { isLoading: isEditing, isSuccess: isEdited, isError: isEditError, error: editError }] =
    useEditOAuthConfigMutation();

  // form state
  const [status, setStatus] = useState<FormStatus>('empty');

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  // customJsonRenderers
  const customRenderers = getCustomRenderers({});

  useEffect(() => {
    if (isCreated || isEdited) {
      setStatus('success');
      handleNavigationOnSuccess();
    }
  }, [isCreated, isEdited]);

  useEffect(() => {
    if (isCreateError || isEditError) {
      setStatus('error');

      // extract errors from createError || editError
      const errors = getErrorsInErrorObject(createError || editError);

      const { message = '' } = errors || {};

      // open alert dialog
      handleAlertOpen({ message: message, alertType: 'error' as AlertStatus });
    }
  }, [isCreateError, isEditError]);

  const handleNavigationOnSuccess = () => {
    router.push(`/spaces/${workspaceId}/oauth-apps`);
  };

  /**
   * Responsible for opening alert dialog.
   */
  const handleAlertOpen = ({ message = '', alertType }: { message: string | any; alertType: AlertStatus }) => {
    setAlertState({
      message: message,
      show: true,
      type: alertType
    });
  };

  /**
   * Responsible for closing alert dialog.
   */
  const handleAlertClose = () => {
    setAlertState({
      message: '',
      show: false,
      type: 'empty'
    });
  };

  const PageContent = ({ initialData }: { initialData: any }) => {
    const [data, setData] = useState(initialData);

    const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
      setData(data);
    };

    const handleSubmit = () => {
      setStatus('submitting');
      const payload = {
        workspaceId: workspaceId,
        oauth: {
          oauth_config: data,
          type: connectorType
        }
      };

      const { ids = [] } = keys ?? {};

      if (ids.length > 0) {
        editObject(payload);
      } else {
        createObject(payload);
      }
    };

    return (
      <ConnectorLayout title={''}>
        {/** Display Content */}
        <FormLayout
          formComp={
            <FormControlComponent
              key={`OAuthConfigurationFormControl`}
              deleteTooltip=""
              editing={false}
              onDelete={() => {}}
              onFormChange={handleFormChange}
              onSubmitClick={handleSubmit}
              isDeleting={false}
              status={status}
              jsonFormsProps={{ data: data, schema: schema, renderers: customRenderers }}
              removeAdditionalFields={false}
            />
          }
          instructionsComp={<OAuthInstructions key={`oAuth instructions`} data={schema} type={type} />}
        />
      </ConnectorLayout>
    );
  };

  return (
    <PageLayout pageHeadTitle={'Create OAuth Configuration'} title={'Create OAuth Configuration'} displayButton={false}>
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
      />
      <ContentLayout
        key={`createOAuthConfiguration${type}`}
        error={error || keysError}
        PageContent={<PageContent initialData={processData(keys ?? initialData)} />}
        displayComponent={(!error || !keysError) && (!isLoading || !isKeysLoading) && schema && keys}
        isLoading={isLoading && isKeysLoading}
        traceError={traceError || isKeysTraceError}
      />
    </PageLayout>
  );
};

CreateOAuthConfigurationLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateOAuthConfigurationLayout;
