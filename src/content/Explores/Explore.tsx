import CustomCard from '@/components/CustomCard';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import { Grid, IconButton, Tooltip } from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import { PromptFilterChip } from '@/content/Prompts/Prompt';

type TExploreProps = {
  item: any;
  handleOnClick: (item: any) => void;
  src: string;
};

const Explore = ({ item, handleOnClick, src }: TExploreProps) => {
  const {
    account: { external_id = '' },
    prompt: { name = '', description = '', parameters = {} } = ({} = {})
  } = item ?? {};

  const title = `valmi.io - ${name}`;

  return (
    <Grid item xs={'auto'} sm={4} md={4}>
      <CustomCard
        startIcon={<ImageComponent src={src} alt="connector" size={ImageSize.medium} />}
        endIcon={
          <Tooltip title="download">
            <IconButton sx={{ ml: 2 }} color="primary" onClick={() => handleOnClick(item)}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        }
        title={title}
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
