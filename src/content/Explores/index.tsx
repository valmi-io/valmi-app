import { TData } from '@/utils/typings.d';
import { Grid } from '@mui/material';

import Explore from '@/content/Explores/Explore';
import { useRouter } from 'next/router';
import { getBaseRoute } from '@/utils/lib';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useFetch } from '@/hooks/useFetch';
import { useGetExploreStatusByIdQuery } from '@/store/api/etlApiSlice';
import { useSearchParams } from 'next/navigation';
import { getSearchParams } from '@/utils/router-utils';

const Explores = ({ data }: { data: TData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);
  const { wid = '' } = params;

  const { workspaceId = '' } = useWorkspaceId();
  const src = `/connectors/google-sheets.svg`;

  const exploreReadyStatus = (item: any) => {
    const { data: status } = useFetch({
      query: useGetExploreStatusByIdQuery({ workspaceId: wid, exploreId: item.id })
    });
    return status?.status;
  };

  const handleOnClick = (item: any) => {
    // handle explore download
  };

  const handlePreviewOnClick = (item: any) => {
    router.push(`${getBaseRoute(workspaceId!)}/explores/${item.id}`);
  };

  return (
    <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ padding: 2 }}>
      {data.ids.map((id: string) => (
        <Explore
          key={id}
          item={data.entities[id]}
          handleOnClick={handleOnClick}
          handlePreviewOnClick={handlePreviewOnClick}
          src={src}
          exploreReadyStatus={exploreReadyStatus}
        />
      ))}
    </Grid>
  );
};

export default Explores;
