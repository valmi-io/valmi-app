import { ReactElement, useEffect, useState } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import { useSearchParams } from 'next/navigation';

import SidebarLayout from '@layouts/SidebarLayout';
import DataTable from '@/components/DataTable';
import { useLazyGetPreviewDataQuery } from '@/store/api/etlApiSlice';
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

  const [preview, { data, isFetching, error }] = useLazyGetPreviewDataQuery();

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

  return (
    <PageLayout pageHeadTitle="Preview" title="Preview" displayButton={false}>
      <Filters val={filter} params={params} isDataFetching={isFetching} />
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

const Filters = ({ val, params, isDataFetching }: { val: string; params: IPreviewPage; isDataFetching: boolean }) => {
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
        data={null}
        isFetching={false}
        disabled={isDataFetching}
        onClick={() => {}}
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
