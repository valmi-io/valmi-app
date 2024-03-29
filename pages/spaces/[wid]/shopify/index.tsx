/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Saturday, March 30th 2024, 1:53:35 am
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { initialiseFlowState } from '@content/SyncFlow/stateManagement';

import { RootState } from '@store/reducers';
import { AppDispatch } from '@store/store';
import ContentLayout from '@/layouts/ContentLayout';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import SyncsTable from '@/content/Syncs/SyncsPage/SyncsTable';
import { useFetch } from '@/hooks/useFetch';
import { useFetchSyncsQuery } from '@/store/api/apiSlice';
import { Box, Button, IconButton, Stack } from '@mui/material';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import { initialiseConnectorSelectionState } from '@/utils/connection-utils';
import CustomIcon from '@/components/Icon/CustomIcon';
import appIcons from '@/utils/icon-utils';
import FormFieldText from '@/components/FormInput/FormFieldText';
import { FormStatus } from '@/utils/form-utils';

const ShopifyPage: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  /** Redux store */

  const { workspaceId = '' } = appState;

  const connection_flow = useSelector((state: RootState) => state.connectionFlow);

  const [displayCopyButton, setDisplayCopyButton] = useState(false);

  // create form state
  const [formState, setFormState] = useState<{
    status: FormStatus;
    value: string;
  }>({
    status: 'empty',
    value: ''
  });

  useEffect(() => {
    if (connection_flow?.flowState?.oauth_params) {
      setDisplayCopyButton(true);
    }
  }, [connection_flow?.flowState?.oauth_params]);

  const handleOAuthButtonClick = async () => {
    const oAuthRoute = `/api/oauth2/login/shopify`;

    let obj = {
      workspace: workspaceId,
      connector: 'shopify',
      oauth_keys: 'public',
      shop: formState.value
    };

    let state = encodeURIComponent(JSON.stringify(obj));

    router.push(`${oAuthRoute}?state=${state}`);
  };

  const handleCopyToClipboard = () => {
    const obj = {
      client_id: process.env.AUTH_SHOPIFY_CLIENT_ID,
      client_secret: process.env.AUTH_SHOPIFY_CLIENT_SECRET,
      shop: formState.value,
      ...(connection_flow?.flowState?.oauth_params ?? {})
    };

    initialiseConnectorSelectionState(dispatch, connection_flow);

    navigator.clipboard.writeText(JSON.stringify(obj, null, 4));

    setDisplayCopyButton(false);
  };

  const handleOnChange = (event: any) => {
    setFormState((state) => ({
      ...state,
      value: event.target.value
    }));
  };

  const PageContent = () => {
    return (
      <Stack spacing={2} mt={2}>
        <Button
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
          variant="contained"
          disabled={formState.value ? false : true}
          onClick={handleOAuthButtonClick}
        >
          <ImageComponent
            src={`/connectors/shopify.svg`}
            alt="connector"
            size={ImageSize.medium}
            style={{ marginBottom: '14px' }}
          />
          {'Shopify'}
        </Button>

        {displayCopyButton && (
          <IconButton sx={{ ml: 2 }} color="primary" onClick={handleCopyToClipboard}>
            <CustomIcon icon={appIcons.CLIPBOARD} />
          </IconButton>
        )}
      </Stack>
    );
  };

  return (
    <PageLayout pageHeadTitle="Shopify" title="Shopify" displayButton={false}>
      <FormFieldText
        field={{}}
        description={`The name of your Shopify store found in the URL. For example, if your URL was https://NAME.myshopify.com, then the name would be 'NAME' or 'NAME.myshopify.com'.", "pattern": "^(?!https://)(?!https://).*", "examples": ["my-store", "my-store.myshopify.com"]`}
        fullWidth
        label="shop"
        type="text"
        required
        error={false}
        value={formState.value}
        onChange={handleOnChange}
      />
      <ContentLayout
        key={`shopifypage`}
        error={false}
        PageContent={<PageContent />}
        displayComponent={true}
        isLoading={false}
        traceError={false}
      />
    </PageLayout>
  );
};

ShopifyPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default ShopifyPage;
