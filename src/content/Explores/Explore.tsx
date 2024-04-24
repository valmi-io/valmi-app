import CustomCard from '@/components/CustomCard';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import { Grid, IconButton, Tooltip } from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { PromptFilterChip } from '@/content/Prompts/Prompt';

type TExploreProps = {
  item: any;
  handleOnClick: (item: any) => void;
  handlePreviewOnClick: (item: any) => void;
  src: string;
};

const Explore = ({ item, handleOnClick, handlePreviewOnClick, src }: TExploreProps) => {
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
            <Tooltip title="preview sheet">
              <IconButton sx={{ ml: 2 }} color="primary" onClick={() => handlePreviewOnClick(item)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
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
