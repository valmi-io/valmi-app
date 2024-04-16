import CustomIcon from '@/components/Icon/CustomIcon';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import appIcons from '@/utils/icon-utils';
import { Chip, Grid, IconButton, Paper, Stack, Tooltip, Typography, darken, styled } from '@mui/material';

type TPrompt = {
  id: string;
  name: string;
  gated: boolean;
  package_id: string;
  parameters: any;
  query: string;
  description: string;
};

const Card = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  cursor: 'pointer',
  padding: theme.spacing(2),
  borderRadius: 5
}));

const Filter = styled(Chip)(({ theme }) => ({
  color: theme.colors.alpha.white[100],
  borderRadius: 4,
  backgroundColor: '#B497FF'
}));

const Prompt = ({ item }: { item: TPrompt }) => {
  const src = `/connectors/shopify.svg`;
  return (
    <Grid item xs={'auto'} sm={4} md={4}>
      <Paper sx={{ borderRadius: 1 }} variant="outlined">
        <Card
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
            <ImageComponent src={src} alt="connector" size={ImageSize.medium} />

            <Tooltip title="">
              <IconButton sx={{ ml: 2 }} color="primary" onClick={() => {}}>
                <CustomIcon style={{ fontSize: ImageSize.medium }} icon={appIcons.CIRCLE_PLUS_OUTLINED} />
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h4" color="text.primary">
              {item.name}
            </Typography>
            <Typography sx={{ color: (theme) => theme.colors.alpha.black[50] }} variant="body1">
              {item.description}
            </Typography>
          </Stack>

          <Stack sx={{ display: 'flex', flexDirection: 'row', pt: 2, flexWrap: 'wrap' }} gap={1}>
            {Object.keys(item.parameters).map((val, i) => (
              <Filter key={`${i.toString()}`} label={val} size="medium" />
            ))}
          </Stack>
        </Card>
      </Paper>
    </Grid>
  );
};

export default Prompt;
