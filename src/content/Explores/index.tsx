import { TData } from '@/utils/typings.d';
import { Grid } from '@mui/material';

import Explore from '@/content/Explores/Explore';
import { useRouter } from 'next/router';
import { getBaseRoute } from '@/utils/lib';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';

const Explores = ({ data }: { data: TData }) => {
  const router = useRouter();
  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;
  const src = `/connectors/google-sheets.svg`;

  const handleOnClick = (item: any) => {
    // handle explore download
  };

  const handlePreviewOnClick = (item: any) => {
    router.push(`${getBaseRoute(workspaceId)}/explores/${item.id}`);
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
        />
      ))}
    </Grid>
  );
};

export default Explores;
