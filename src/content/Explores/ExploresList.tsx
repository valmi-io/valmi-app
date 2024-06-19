import { TData } from '@/utils/typings.d';
import { Grid, styled } from '@mui/material';

import ExploreCard from '@/content/Explores/ExploreCard';
import { useRouter } from 'next/router';
import { getBaseRoute } from '@/utils/lib';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useFetch } from '@/hooks/useFetch';
import { useSearchParams } from 'next/navigation';
import { getSearchParams, redirectToConnectionRuns } from '@/utils/router-utils';

const Container = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.spacing(2),
  isolation: 'isolate'
}));

const ExploresList = ({ data, id: queryId }: { data: TData; id: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);
  const { wid = '' } = params;

  const { workspaceId = '' } = useWorkspaceId();
  const src = `/connectors/google-sheets.svg`;

  const handleIconOnClick = (item: any) => {
    redirectToConnectionRuns({ router, wid: workspaceId, connId: item.sync_id });
  };

  const handlePreviewOnClick = (item: any) => {
    router.push(`${getBaseRoute(workspaceId!)}/explores/${item.id}`);
  };

  return (
    <Container container>
      {data.ids.map((id: string) => {
        const syncIdOfExplore = data.entities[id].sync_id;
        const selected = syncIdOfExplore === queryId;
        return (
          <ExploreCard
            key={id}
            item={data.entities[id]}
            handleIconOnClick={handleIconOnClick}
            handlePreviewOnClick={handlePreviewOnClick}
            src={src}
            selected={selected}
          />
        );
      })}
    </Container>
  );
};

export default ExploresList;
