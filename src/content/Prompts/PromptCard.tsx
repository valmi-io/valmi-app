import CustomIcon from '@/components/Icon/CustomIcon';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import SubmitButton from '@/components/SubmitButton';
import appIcons from '@/utils/icon-utils';
import { TPrompt } from '@/utils/typings.d';
import { Grid, Paper, Stack, Typography, styled } from '@mui/material';
import { useCallback, useMemo } from 'react';

const Card = styled(Paper)(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  isolation: 'isolate',
  width: 360,
  height: 198,
  backgroundColor: 'rgba(42, 157, 144, 0.12)',
  // border: '1px solid #E0E0E0',
  overflow: 'hidden',
  position: 'relative'
}));

const PromptIconContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  width: '67.88px',
  height: '67.88px',
  right: '-43.88px',
  top: theme.spacing(1),
  backgroundColor: 'transparent'
}));

const Rectangle = styled(Paper)(({}) => ({
  position: 'absolute',
  width: '48px',
  height: '48px',
  left: '0',
  top: '-33.94px',
  backgroundColor: 'rgba(42, 157, 144, 0.3)',
  transform: 'rotate(-45deg)'
}));

const PromptHeaderContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const PromptDescriptionContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: 72,
  overflow: 'hidden'
}));

const PromptFooterContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: 46,
  padding: theme.spacing(1, 0),
  alignItems: 'center',
  justifyContent: 'flex-end'
}));

type TPromptProps = {
  item: TPrompt;
  handleOnClick: (item: TPrompt) => void;
};

const PromptHeader = ({ icon, title }: { icon: any; title: string }) => {
  return (
    <PromptHeaderContainer>
      {icon && <ImageComponent src={icon} alt="connector" size={ImageSize.medium} />}
      <PromptTitle title={title} />
    </PromptHeaderContainer>
  );
};

const PromptTitle = ({ title }: { title: string }) => {
  return <Typography variant="h6">{title}</Typography>;
};

const PromptFooter = ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => {
  return (
    <PromptFooterContainer>
      <SubmitButton
        buttonText={'PREVIEW'}
        data={null}
        isFetching={false}
        size="small"
        disabled={disabled}
        onClick={onClick}
      />
    </PromptFooterContainer>
  );
};

const PromptDescription = ({ description }: { description: string }) => {
  return (
    <PromptDescriptionContainer>
      <Typography variant="body1">{description} </Typography>
    </PromptDescriptionContainer>
  );
};

const PromptCard = ({ item, handleOnClick }: TPromptProps) => {
  const icon = useMemo(() => {
    const integrationType: string = item?.type?.split('_').slice(1).join('_') ?? '';

    return `/connectors/${integrationType.toLowerCase()}.svg`;
  }, [item.type]);

  const onClick = useCallback(() => {
    handleOnClick(item);
  }, [item]);

  return (
    <Grid item xs={'auto'}>
      <Card variant="outlined" sx={{ opacity: item?.enabled ? 1 : 0.5 }}>
        <PromptIconContainer>
          <Rectangle>
            <CustomIcon style={{ fontSize: 14, position: 'absolute', top: 16 }} icon={appIcons.CIRCLE_DOT} />
          </Rectangle>
        </PromptIconContainer>
        <PromptHeader key={'PromptHeader'} icon={icon} title={item.name} />
        <PromptDescription key={'PromptDescription'} description={item.description} />
        <PromptFooter key={'PromptFooter'} disabled={!item?.enabled} onClick={onClick} />
      </Card>
    </Grid>
  );
};

export default PromptCard;
