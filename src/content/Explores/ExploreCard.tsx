import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import { CircularProgress, Grid, IconButton, Paper, Stack, Tooltip, Typography, styled, useTheme } from '@mui/material';
import CustomIcon from '@/components/Icon/CustomIcon';
import appIcons from '@/utils/icon-utils';
import SubmitButton from '@/components/SubmitButton';
import { getTimeAt, getTimeAgo } from '@/utils/date-utils';

type TExploreProps = {
  item: any;
  handleIconOnClick: (item: any) => void;
  handlePreviewOnClick: (item: any) => void;
  src: string;
};

type TExploreFooterProps = {
  disabled: boolean;
  onClick: () => void;
  item: any;
  handleIconOnClick: () => void;
};

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
  overflow: 'hidden',
  position: 'relative'
}));

const ExploreIconContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  width: '67.88px',
  height: '67.88px',
  right: '-43.88px',
  top: theme.spacing(2),
  backgroundColor: 'transparent'
}));

const Rectangle = styled(Paper)(({}) => ({
  position: 'absolute',
  width: '48px',
  height: '48px',
  left: '0',
  top: '-39.94px',
  backgroundColor: 'rgba(42, 157, 144, 0.3)',
  transform: 'rotate(-45deg)'
}));

const ExploreHeaderContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const ExploreDescriptionContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  justifyContent: 'center',
  gap: theme.spacing(1),
  width: '100%',
  height: 72,
  overflow: 'hidden'
}));

const ExploreFooterContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: 46,
  padding: theme.spacing(1, 0),
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing(2)
}));

const MetaInfoContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2)
}));

const StatusChip = styled(Stack)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}));

const MetaInfoChip = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center'
}));

const MetaInfo = ({ item }: { item: any }) => {
  return (
    <MetaInfoContainer>
      <MetaInfoChip>
        <Typography variant="caption" sx={{ color: (theme) => theme.colors.secondary.main }}>
          LAST SYNCED
        </Typography>
        <Typography variant="caption">{getTimeAgo(item?.last_sync_succeeded_at)}</Typography>
      </MetaInfoChip>
      <MetaInfoChip>
        <Typography variant="caption" sx={{ color: (theme) => theme.colors.secondary.main }}>
          CREATED AT
        </Typography>
        <Typography variant="caption">{getTimeAt(item?.last_sync_created_at)}</Typography>
      </MetaInfoChip>
    </MetaInfoContainer>
  );
};
const ExploreHeader = ({ icon, title }: { icon: any; title: string }) => {
  return (
    <ExploreHeaderContainer>
      {icon && <ImageComponent src={icon} alt="connector" size={ImageSize.medium} />}
      <ExploreTitle title={title} />
    </ExploreHeaderContainer>
  );
};

const ExploreTitle = ({ title }: { title: string }) => {
  return <Typography variant="h6">{title}</Typography>;
};

const StatusIcon = ({
  sync_state,
  last_sync_result,
  onClick
}: {
  sync_state: string;
  last_sync_result: string;
  onClick: () => void;
}) => {
  const theme = useTheme();
  if (sync_state === 'RUNNING') {
    return <CircularProgress size={16} />;
  } else if (sync_state === 'IDLE' && last_sync_result === 'FAILED') {
    return (
      <Paper onClick={onClick}>
        <CustomIcon style={{ fontSize: 16, color: theme.colors.primary.main }} icon={appIcons.WARNING} />
      </Paper>
    );
  }
};

const ExploreFooter = ({ disabled, onClick, item, handleIconOnClick }: TExploreFooterProps) => {
  return (
    <ExploreFooterContainer>
      <MetaInfo item={item} />
      <StatusChip>
        <StatusIcon
          sync_state={item?.sync_state}
          last_sync_result={item?.last_sync_result}
          onClick={handleIconOnClick}
        />
      </StatusChip>
      <SubmitButton
        buttonText={'EXPLORE'}
        data={null}
        isFetching={false}
        size="small"
        disabled={!item?.enabled || item?.last_sync_succeeded_at === ''}
        onClick={onClick}
      />
    </ExploreFooterContainer>
  );
};

const ExploreDescription = ({ description }: { description: string }) => {
  return (
    <>
      <ExploreDescriptionContainer>
        <CustomIcon style={{ fontSize: 14 }} icon={appIcons.CIRCLE_DOT} />
        <Typography variant="body1">{description}</Typography>
      </ExploreDescriptionContainer>
    </>
  );
};

const ExploreCard = ({ item, handlePreviewOnClick, src, handleIconOnClick }: TExploreProps) => {
  return (
    <Grid item xs={'auto'} sm={4} md={4}>
      <Card variant="outlined" sx={{ opacity: item?.enabled ? 1 : 0.6 }}>
        <ExploreIconContainer>
          <Rectangle>
            <ImageComponent
              src={src}
              alt="connector"
              size={ImageSize.small}
              style={{ position: 'absolute', width: 10, transform: ' rotate(45deg)', top: 15, left: 5 }}
            />
          </Rectangle>
        </ExploreIconContainer>
        <ExploreHeader key={'ExploreHeader'} icon={''} title={item.name} />
        <ExploreDescription key={'ExploreDescription'} description={item.description} />
        <ExploreFooter
          key={'ExploreFooter'}
          disabled={item?.enabled}
          onClick={() => handlePreviewOnClick(item)}
          handleIconOnClick={() => handleIconOnClick(item)}
          item={item}
        />
      </Card>
    </Grid>
  );
};

export default ExploreCard;
