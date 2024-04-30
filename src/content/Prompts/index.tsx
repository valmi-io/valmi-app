import { TData } from '@/utils/typings.d';
import { Grid } from '@mui/material';

import Prompt, { TPrompt } from '@/content/Prompts/Prompt';
import { useRouter } from 'next/router';
import { getBaseRoute } from '@/utils/lib';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const Prompts = ({ data }: { data: TData }) => {
  const router = useRouter();

  const { workspaceId = null } = useWorkspaceId();

  const src = `/connectors/shopify.svg`;

  const handleOnClick = (prompt: TPrompt) => {
    // redirect to preview page

    router.push(`${getBaseRoute(workspaceId)}/prompts/${prompt.id}?filter=Last 7 days`);
  };

  return (
    <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ padding: 2 }}>
      {data.ids.map((id: string) => (
        <Prompt key={id} item={data.entities[id]} handleOnClick={handleOnClick} src={src} />
      ))}
    </Grid>
  );
};

export default Prompts;
