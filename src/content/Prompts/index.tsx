import { TData } from '@/utils/typings.d';
import { Grid } from '@mui/material';

import Prompt from '@/content/Prompts/Prompt';

const Prompts = ({ data }: { data: TData }) => {
  return (
    <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ padding: 2 }}>
      {data.ids.map((id: string) => (
        <Prompt key={id} item={data.entities[id]} />
      ))}
    </Grid>
  );
};

export default Prompts;
