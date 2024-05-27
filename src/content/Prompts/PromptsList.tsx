import { TData, TPrompt } from '@/utils/typings.d';
import { Grid, styled } from '@mui/material';

import PromptCard from '@/content/Prompts/PromptCard';
import { useRouter } from 'next/router';
import { getBaseRoute } from '@/utils/lib';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const Container = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
  isolation: 'isolate'
}));

const PromptsList = ({ data }: { data: TData }) => {
  const router = useRouter();

  const { workspaceId = '' } = useWorkspaceId();

  const handleOnClick = (prompt: TPrompt) => {
    // redirect to preview page
    router.push(`${getBaseRoute(workspaceId)}/prompts/${prompt.id}?filter=Last 7 days`);
  };

  return (
    <Container container>
      {data.ids.map((id: string) => (
        <PromptCard key={id} item={data.entities[id]} handleOnClick={handleOnClick} />
      ))}
    </Container>
  );
};

export default PromptsList;
