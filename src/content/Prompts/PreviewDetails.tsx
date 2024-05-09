//@S-Nagendra
import ErrorComponent, { ErrorStatusText } from '@/components/Error';
import CustomIcon from '@/components/Icon/CustomIcon';
import { StackLayout } from '@/components/Layouts/Layouts';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import SkeletonLoader from '@/components/SkeletonLoader';
import { PromptFilterChip, TPrompt } from '@/content/Prompts/Prompt';
import { useFetch } from '@/hooks/useFetch';
import { IPreviewPage } from '@/pagesspaces/[wid]/prompts/[pid]';
import { useGetPromptByIdQuery } from '@/store/api/etlApiSlice';
import { getLastNthDate } from '@/utils/date-utils';
import { getPromptFilter } from '@/utils/explore-utils';
import appIcons from '@/utils/icon-utils';
import { isDataEmpty } from '@/utils/lib';
import { TData } from '@/utils/typings.d';
import { Card, Stack, Typography } from '@mui/material';

const PreviewDetails = ({ params }: { params: IPreviewPage }) => {
  const { pid = '', filter = '', wid = '' } = params;

  const { data, error, isLoading, traceError } = useFetch({
    query: useGetPromptByIdQuery({ promptId: pid, workspaceId: wid })
  });

  return (
    <Card variant="outlined">
      {/** Display Errors */}
      {error && <ErrorComponent error={error} />}

      {/** Display Trace Error */}
      {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

      <SkeletonLoader loading={isLoading} />

      {!error && !isLoading && data && <PageContent data={data} filter={filter} />}
    </Card>
  );
};

export default PreviewDetails;

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
