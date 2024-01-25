/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 23rd 2024, 1:49:02 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useEffect, useState } from 'react';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  getDestinationSelectors,
  useCreateDestinationMutation,
  useDeleteDestinationMutation,
  useDestinationSchemaQuery,
  useEditDestinationMutation
} from '@store/api/streamApiSlice';
import { RootState } from '@store/reducers';
import { generateUUID, isTrue } from '@/utils/lib';
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
  getOAuthSelectors,
  useCreateOAuthConfigMutation,
  useEditOAuthConfigMutation,
  useOAuthSchemaQuery
} from '@/store/api/oauthApiSlice';
import { materialRenderers } from '@jsonforms/material-renderers';
import OAuthInstructions from '@/content/OAuthApps/OAuthInstructions';

const CreateOAuthConfigurationLayout = () => {
  // Get type from router
  const router = useRouter();
  const { type } = router.query;
  if (!type) return <></>;
  else return <CreateOAuthConfiguration type={type} />;
};

const CreateOAuthConfiguration = ({ type }: any) => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const { workspaceId = '' } = appState;

  // Getting schema for the object
  const { data: schema, isLoading, traceError, error } = useFetch({ query: useOAuthSchemaQuery({ type }) });

  // Getting from redux to decide creating/editing
  const { editing = false } = useSelector((state: RootState) => state.oAuthFlow);

  // Getting stream selectors for editing case specifically - not useful for create case
  const { selectOAuthConfigById } = getOAuthSelectors(workspaceId as string);
  const oAuthData = useSelector((state) => selectOAuthConfigById(state, type));

  let initialData = {};

  //   if (isTrue(editing)) {
  //     initialData = destinationData;
  //   }

  if (isTrue(editing)) {
    initialData = oAuthData?.oauth_config ?? {};
  }

  // Mutation for creating Schema object
  const [createObject, { isLoading: isCreating, isSuccess: isCreated, isError: isCreateError, error: createError }] =
    useCreateOAuthConfigMutation();

  // Mutation for editing Schema object
  const [editObject, { isLoading: isEditing, isSuccess: isEdited, isError: isEditError, error: editError }] =
    useEditOAuthConfigMutation();

  const [data, setData] = useState<any>(initialData);

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

  const handleSubmit = () => {
    setStatus('submitting');
    const payload = {
      workspaceId: workspaceId,
      oauth: {
        oauth_config: data,
        type: type
      }
    };

    if (editing) {
      editObject(payload);
    } else {
      createObject(payload);
    }
  };

  //   const handleDelete = () => {
  //     const payload = { workspaceId: workspaceId, destinationId: destinationId };
  //     deleteObject(payload);
  //   };

  const handleNavigationOnSuccess = () => {
    router.push(`/spaces/${workspaceId}/oauth-apps`);
  };

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
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

  const PageContent = () => {
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
              error={error}
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
        error={error}
        PageContent={<PageContent />}
        displayComponent={!error && !isLoading && schema}
        isLoading={isLoading}
        traceError={traceError}
      />
    </PageLayout>
  );
};

CreateOAuthConfigurationLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateOAuthConfigurationLayout;
