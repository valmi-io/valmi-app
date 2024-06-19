import PromptDetailsTitleCard from '@/content/Prompts/PromptDetailsTitleCard';
import { TPrompt } from '@/utils/typings.d';
import { Paper, Stack, Typography, styled } from '@mui/material';

const CardWrapper = styled(Paper)(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2)
}));

const PromptDescription = ({ description }: { description: string }) => {
  return (
    <Stack>
      <Typography variant="body1">{description}</Typography>
    </Stack>
  );
};

const PromptDetails = ({ item }: { item: TPrompt }) => {
  return (
    <CardWrapper variant="outlined">
      <PromptDetailsTitleCard item={item} />

      <PromptDescription description={item?.description ?? ''} />
    </CardWrapper>
  );
};

export default PromptDetails;
