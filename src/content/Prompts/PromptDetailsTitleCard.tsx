import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import { getConnectorImageName } from '@/utils/lib';
import { TPrompt } from '@/utils/typings.d';
import { Stack, Typography, styled, useTheme } from '@mui/material';

const PromptTitleContainer = styled(Stack)(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}));

const PromptDetailsTitleCard = ({ item }: { item: TPrompt }) => {
  const theme = useTheme();
  return (
    <PromptTitleContainer>
      <ImageComponent
        src={getConnectorImageName({ type: item?.type ?? '' })}
        alt="catalog"
        style={{ marginRight: theme.spacing(1) }}
        size={ImageSize.syncDetailsCard}
      />

      <Typography variant="h6">{item.name}</Typography>
    </PromptTitleContainer>
  );
};

export default PromptDetailsTitleCard;
