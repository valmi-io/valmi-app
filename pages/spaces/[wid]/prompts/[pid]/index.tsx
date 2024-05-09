import { ReactElement } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import { useSearchParams } from 'next/navigation';

import SidebarLayout from '@layouts/SidebarLayout';
import { getSearchParams } from '@/utils/router-utils';
import { isEmpty } from 'lodash';
import { IParams, TData } from '@/utils/typings.d';
import PageLayout from '@/layouts/PageLayout';
import { Stack, Typography } from '@mui/material';
import { useFetch } from '@/hooks/useFetch';
import { useGetPromptByIdQuery } from '@/store/api/etlApiSlice';
import ContentLayout from '@/layouts/ContentLayout';
import { isDataEmpty } from '@/utils/lib';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { getLastNthDate } from '@/utils/date-utils';
import { getPromptFilter } from '@/utils/explore-utils';
import { PromptFilterChip, TPrompt } from '@/content/Prompts/Prompt';
import { StackLayout } from '@/components/Layouts/Layouts';
import appIcons from '@/utils/icon-utils';
import CustomIcon from '@/components/Icon/CustomIcon';

export interface IPreviewPage extends IParams {
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
  const { pid = '', filter = '', wid = '' } = params;

  const { data, error, isLoading, traceError } = useFetch({
    query: useGetPromptByIdQuery({ promptId: pid, workspaceId: wid })
  });

  return (
    <PageLayout pageHeadTitle="DATA PREVIEW" title="DATA PREVIEW" displayButton={false}>
      <ContentLayout
        key={`prompt-preview-page`}
        error={error}
        PageContent={<PageContent data={data} filter={filter} />}
        displayComponent={!!(!error && !isLoading && data)}
        isLoading={isLoading}
        traceError={traceError}
      />
    </PageLayout>
  );
};

PreviewPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default PreviewPageLayout;

const PageContent = ({ data, filter }: { data: TData; filter: string }) => {
  const { ids, entities } = data;

  if (isDataEmpty(data)) {
    return <ListEmptyComponent description={'No data found for this prompt'} />;
  }

  const prevDate = getLastNthDate(getPromptFilter(filter));

  const currDate = getLastNthDate(1);

  const chip = `${prevDate} - ${currDate} `;

  return ids.map((id: string) => {
    const item: TPrompt = entities[id];
    return (
      <StackLayout key={id} spacing={2}>
        {/** Prompt name */}

        <Stack spacing={1} direction="row">
          {appIcons.NAME}
          <Typography variant="body1" color="text.primary">
            {item.name}
          </Typography>
        </Stack>

        {/** Prompt description */}

        <Stack spacing={1} direction="row">
          {appIcons.NAME}
          <Typography variant="body2">{item.description}</Typography>
        </Stack>

        <Stack spacing={1} direction="row" alignItems="center">
          <CustomIcon icon={appIcons.SCHEDULE} />
          <PromptFilterChip label={chip} size="medium" />
        </Stack>
      </StackLayout>
    );
  });
};
