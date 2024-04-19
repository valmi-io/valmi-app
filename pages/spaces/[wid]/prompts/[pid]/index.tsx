import { ReactElement, useEffect, useState } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import { useSearchParams } from 'next/navigation';

import SidebarLayout from '@layouts/SidebarLayout';
import DataTable from '@/components/DataTable';
import { useCreateExploreMutation, useLazyGetPreviewDataQuery } from '@/store/api/etlApiSlice';
import { getSearchParams } from '@/utils/router-utils';
import { isEmpty } from 'lodash';
import { IParams, TData } from '@/utils/typings.d';
import PageLayout from '@/layouts/PageLayout';
import ContentLayout from '@/layouts/ContentLayout';
import { getBaseRoute, isDataEmpty } from '@/utils/lib';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import PageTitle from '@/components/PageTitle';
import { Box, Stack } from '@mui/material';
import SubmitButton from '@/components/SubmitButton';
import FormControlComponent from '@/components/FormControlComponent';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import { JsonFormsCore } from '@jsonforms/core';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import { generateExplorePayload } from '@/utils/explore-utils';
import { FormStatus } from '@/utils/form-utils';
import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import { queryHandler } from '@/services';

interface IPreviewPage extends IParams {
  pid: string;
  filter: string;
}

const PreviewPageLayout: NextPageWithLayout = () => {
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  if (isEmpty(params)) return <></>;
  else return <PreviewPage params={params} />;
};

const PreviewPage = ({ params }: { params: IPreviewPage }) => {
  const { pid = '', wid = '', filter = '' } = params;

  const router = useRouter();

  const [preview, { data, isFetching, error }] = useLazyGetPreviewDataQuery();

  const [createObject] = useCreateExploreMutation();

  const user = useSelector((state: RootState) => state.user.user);

  // form state - form can be in any of the states {FormStatus}
  const [status, setStatus] = useState<FormStatus>('empty');

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  useEffect(() => {
    if (filter) {
      getData();
    }
  }, [filter]);

  const getData = () => {
    preview({
      workspaceId: wid,
      promptId: pid
    });
  };

  const handleSaveAsExplore = () => {
    setStatus('submitting');
    const payload = generateExplorePayload(wid, pid, user);

    createExploreHandler({ query: createObject, payload: payload });
  };

  const successCb = (data: any) => {
    setStatus('success');
    handleNavigationOnSuccess();
  };

  const errorCb = (error: any) => {
    setStatus('error');
    handleAlertOpen({ message: error, alertType: 'error' as AlertStatus });
  };

  const createExploreHandler = async ({ query, payload }: { query: any; payload: any }) => {
    await queryHandler({ query, payload, successCb, errorCb });
  };

  const handleNavigationOnSuccess = () => {
    router.push(`${getBaseRoute(wid)}/explores`);
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

  return (
    <PageLayout pageHeadTitle="Preview" title="Preview" displayButton={false}>
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
      />
      <Filters
        val={filter}
        params={params}
        isDataFetching={isFetching}
        handleSaveAsExplore={handleSaveAsExplore}
        status={status}
      />
      <PageTitle title={'Data table'} displayButton={false} />

      <ContentLayout
        key={`PreviewPage`}
        error={error}
        PageContent={<PageContent data={data} />}
        displayComponent={!error && !isFetching && data}
        isLoading={isFetching}
        traceError={false}
      />
    </PageLayout>
  );
};

PreviewPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default PreviewPageLayout;

const PageContent = ({ data }: { data: TData }) => {
  if (isDataEmpty(data)) {
    return <ListEmptyComponent description={'No data found for this prompt'} />;
  }

  return <DataTable data={data} />;
};

const promptFilterSchema = {
  type: 'object',
  properties: {
    filter: {
      type: 'string',
      enum: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last month']
    }
  }
};

const Filters = ({
  val,
  params,
  isDataFetching,
  handleSaveAsExplore,
  status
}: {
  val: string;
  params: IPreviewPage;
  isDataFetching: boolean;
  handleSaveAsExplore: () => void;
  status: string;
}) => {
  const router = useRouter();

  const { pid = '', wid = '' } = params;
  let initialData = {
    filter: val
  };
  const [data, setData] = useState<any>(initialData);
  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days'] });

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);

    router.push(
      {
        pathname: `${getBaseRoute(wid)}/prompts/${pid}`,
        query: { filter: data['filter'] }
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}
      gap={4}
    >
      <SubmitButton
        buttonText={'Save as explore'}
        data={status === 'success'}
        isFetching={status === 'submitting'}
        disabled={isDataFetching || status === 'submitting'}
        onClick={handleSaveAsExplore}
        styles={{ margin: 0 }}
      />
      <Box sx={{ width: 300 }}>
        <FormControlComponent
          key={`promptFilters`}
          editing={false}
          onFormChange={handleFormChange}
          error={false}
          jsonFormsProps={{ data: data, schema: promptFilterSchema, renderers: customRenderers }}
          removeAdditionalFields={false}
          displayActionButton={false}
          disabled={isDataFetching}
        />
      </Box>
    </Stack>
  );
};
