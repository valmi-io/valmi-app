import { TData } from '@/utils/typings.d';
import { Grid } from '@mui/material';

import ExploreCard from '@/content/Explores/ExploreCard';
import { useRouter } from 'next/router';
import { getBaseRoute } from '@/utils/lib';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useFetch } from '@/hooks/useFetch';
import { useSearchParams } from 'next/navigation';
import { getSearchParams } from '@/utils/router-utils';

const ExploresList = ({ data }: { data: TData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);
  const { wid = '' } = params;

  const { workspaceId = '' } = useWorkspaceId();
  const src = `/connectors/google-sheets.svg`;

  const handleIconOnClick = (item: any) => {
    router.push(`${getBaseRoute(workspaceId!)}/connections/${item.sync_id}/runs`);
  };

  const handlePreviewOnClick = (item: any) => {
    router.push(`${getBaseRoute(workspaceId!)}/explores/${item.id}`);
  };

  return (
    <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ padding: 2 }}>
      {data.ids.map((id: string) => (
        <ExploreCard
          key={id}
          item={data.entities[id]}
          handleIconOnClick={handleIconOnClick}
          handlePreviewOnClick={handlePreviewOnClick}
          src={src}
        />
      ))}
    </Grid>
  );
};

export default ExploresList;
