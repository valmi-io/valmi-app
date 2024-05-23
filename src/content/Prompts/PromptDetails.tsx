//@S-Nagendra
import { StackLayout } from '@/components/Layouts/Layouts';
import { TPrompt } from '@/content/Prompts/PromptCard';
import appIcons from '@/utils/icon-utils';
import { Card, Stack, Typography } from '@mui/material';

const PromptDetails = ({ item }: { item: TPrompt }) => {
  return (
    <Card variant="outlined">
      <StackLayout spacing={2}>
        <Stack spacing={1} direction="row">
          {appIcons.NAME}
          <Typography variant="body1" color="text.primary">
            {item.name}
          </Typography>
        </Stack>

        {/** Prompt description */}

        <Stack spacing={1} direction="row">
          {appIcons.NAME}
          <Typography variant="body2">{item.description}</Typography>
        </Stack>
      </StackLayout>
    </Card>
  );
};

export default PromptDetails;
