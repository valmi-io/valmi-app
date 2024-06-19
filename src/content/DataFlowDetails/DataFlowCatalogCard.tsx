import { Stack, Typography, styled, useTheme } from '@mui/material';

import ImageComponent, { ImageSize } from '@components/ImageComponent';
import { getConnectorImageName } from '@/utils/lib';
import { getValmiDataStoreName, getValmiLogoSrc } from '@/utils/app-utils';

const Container = styled(Stack)(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center'
}));

const DataFlowCatalogCard = ({ type, name }: { type: string; name: string | any }) => {
  const theme = useTheme();

  let imageSrc = getConnectorImageName({ type: type });

  if (name === getValmiDataStoreName()) {
    imageSrc = getValmiLogoSrc();
  }
  return (
    <Container>
      <ImageComponent
        src={imageSrc}
        alt="catalog"
        style={{ marginRight: theme.spacing(1) }}
        size={ImageSize.syncDetailsCard}
      />
      <Typography variant="body1">{name.toLowerCase()}</Typography>
    </Container>
  );
};

export default DataFlowCatalogCard;
