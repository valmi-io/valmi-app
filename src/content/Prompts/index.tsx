import { TData } from '@/utils/typings.d';
import { Grid } from '@mui/material';

import Prompt, { TPrompt } from '@/content/Prompts/Prompt';
import { useRouter } from 'next/router';
import { getBaseRoute } from '@/utils/lib';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const Prompts = ({ data }: { data: TData }) => {
  const router = useRouter();

  const { workspaceId = '' } = useWorkspaceId();

  const src = `/connectors/shopify.svg`;

  const handleOnClick = (prompt: TPrompt) => {
    // redirect to preview page

    router.push(`${getBaseRoute(workspaceId!)}/prompts/${prompt.id}?filter=Last 7 days`);
  };

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'flex-start',
        gap: '16px',
        isolation: 'isolate'
      }}
    >
      {data.ids.map((id: string) => (
        <Prompt key={id} item={data.entities[id]} handleOnClick={handleOnClick} src={src} />
      ))}
    </Grid>
  );
};

export default Prompts;
