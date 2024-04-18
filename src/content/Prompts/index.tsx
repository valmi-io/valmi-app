import { TData } from '@/utils/typings.d';
import { Grid } from '@mui/material';

import Prompt from '@/content/Prompts/Prompt';
import { useRouter } from 'next/router';
import { getBaseRoute } from '@/utils/lib';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';

const Prompts = ({ data }: { data: TData }) => {
  const router = useRouter();
  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const handleOnClick = (promptId: string) => {
    // redirect to preview page
    router.push(`${getBaseRoute(workspaceId)}/prompts/${promptId}`);
  };

  return (
    <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ padding: 2 }}>
      {data.ids.map((id: string) => (
        <Prompt key={id} item={data.entities[id]} handleOnClick={handleOnClick} />
      ))}
    </Grid>
  );
};

export default Prompts;
