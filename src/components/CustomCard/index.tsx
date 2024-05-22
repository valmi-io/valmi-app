import CustomIcon from '@/components/Icon/CustomIcon';
import { ImageSize } from '@/components/ImageComponent';
import appIcons from '@/utils/icon-utils';
import { Paper, Stack, Typography, darken, styled } from '@mui/material';

type TCustomCardProps = {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  title?: string;
  desc?: string;
  footer?: React.ReactElement;
};

const Card = styled(Paper)(({ theme }) => ({
  // ...theme.typography.body2,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  isolation: 'isolate',
  width: '360px',
  maxHeight: '360px',
  backgroundColor: 'rgba(42, 157, 144, 0.12)',
  border: '1px solid #E0E0E0',
  overflow: 'hidden',
  position: 'relative'
}));

const CornerWrapper = styled(Paper)(({}) => ({
  position: 'absolute',
  width: '67.88px',
  height: '67.88px',
  right: '-43.88px',
  top: '5px',
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

const IconWrapper = styled(Paper)(({}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  left: '16px',
  top: '36px'
}));

/** This card is used for Explores, Prompts */
const CustomCard = ({ startIcon, endIcon, title, desc, footer }: TCustomCardProps) => {
  return (
    <Card variant="outlined">
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        {startIcon && startIcon}
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" color="text.primary">
            {title}
          </Typography>
          {endIcon && endIcon}
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography sx={{ color: (theme) => theme.colors.alpha.black[50] }} variant="body1" noWrap={false}>
          {desc}
        </Typography>
      </Stack>

      {footer && (
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            pt: 2,
            flexWrap: 'wrap',
            flexGrow: 1,
            alignItems: 'flex-end'
          }}
          gap={1}
        >
          {footer}
        </Stack>
      )}

      <CornerWrapper>
        <Rectangle />
        {/* <IconWrapper> */}
        <CustomIcon style={{ fontSize: ImageSize.small }} icon={appIcons.CIRCLE_DOT} />
        {/* </IconWrapper> */}
      </CornerWrapper>
    </Card>
  );
};

export default CustomCard;
