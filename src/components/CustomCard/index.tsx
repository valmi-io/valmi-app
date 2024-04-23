import { Paper, Stack, Typography, darken, styled } from '@mui/material';

type TCustomCardProps = {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  title?: string;
  desc?: string;
  footer?: React.ReactElement;
};

const Card = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  padding: theme.spacing(2),
  borderRadius: 5,
  minHeight: 300
}));

/** This card is used for Explores, Prompts */
const CustomCard = ({ startIcon, endIcon, title, desc, footer }: TCustomCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: (theme) => darken(theme.colors.alpha.white[5], 1)
      }}
    >
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
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
          {endIcon && endIcon}
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="h4" color="text.primary">
          {title}
        </Typography>
        <Typography sx={{ color: (theme) => theme.colors.alpha.black[50] }} variant="body1">
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
    </Card>
  );
};

export default CustomCard;
