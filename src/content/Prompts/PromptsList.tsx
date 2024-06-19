import { TData, TPrompt } from '@/utils/typings.d';
import { Grid, styled } from '@mui/material';

import PromptCard from '@/content/Prompts/PromptCard';
import { useRouter } from 'next/router';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { redirectToPromptPreview } from '@/utils/router-utils';

const Container = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.spacing(2),
  isolation: 'isolate'
}));

const PromptsList = ({ data }: { data: TData }) => {
  console.log('PROMPT DAA:', data);
  const router = useRouter();

  const { workspaceId = '' } = useWorkspaceId();

  const handleOnClick = (prompt: TPrompt) => {
    // redirect to preview page
    redirectToPromptPreview({ router, wid: workspaceId, promptId: prompt.id });
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
