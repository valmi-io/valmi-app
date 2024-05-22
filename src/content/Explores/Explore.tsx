import CustomCard from '@/components/CustomCard';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import { Chip, Grid, IconButton, Tooltip, styled } from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

type TExploreProps = {
  item: any;
  handleOnClick: (item: any) => void;
  handlePreviewOnClick: (item: any) => void;
  src: string;
  exploreReadyStatus: any;
};

const PromptFilterChip = styled(Chip)(({ theme }) => ({
  color: theme.colors.alpha.white[100],
  borderRadius: 4,
  backgroundColor: '#E55837'
}));

const Explore = ({ item, handleOnClick, handlePreviewOnClick, src, exploreReadyStatus }: TExploreProps) => {
  const {
    name = '',
    account: { external_id = '' },
    prompt: { description = '', parameters = {} } = ({} = {})
  } = item ?? {};

  return (
    <Grid item xs={'auto'} sm={4} md={4}>
      <CustomCard
        startIcon={<ImageComponent src={src} alt="connector" size={ImageSize.medium} />}
        endIcon={
          <>
            <Tooltip title="download">
              <IconButton sx={{ ml: 2 }} color="primary" onClick={() => handleOnClick(item)}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="preview sheet"> */}
            <IconButton
              sx={{ ml: 2 }}
              color="primary"
              disabled={exploreReadyStatus(item) === 'running'}
              onClick={() => handlePreviewOnClick(item)}
            >
              <VisibilityIcon />
            </IconButton>
            {/* </Tooltip> */}
          </>
        }
        title={name}
        desc={description}
        footer={
          <>
            {Object.keys(parameters).map((val, i) => (
              <PromptFilterChip key={`${i.toString()}`} label={'LAST 7 DAYS'} size="medium" />
            ))}
            <PromptFilterChip label={external_id} size="medium" />
          </>
        }
      />
    </Grid>
  );
};

export default Explore;
