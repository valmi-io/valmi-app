import { TData } from '@/utils/typings.d';
import { Grid } from '@mui/material';

import Explore from '@/content/Explores/Explore';

const Explores = ({ data }: { data: TData }) => {
  const src = `/connectors/google-sheets.svg`;

  const handleOnClick = (item: any) => {
    // handle explore download
    // console.log('handle on click:_', item);
  };

  return (
    <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ padding: 2 }}>
      {data.ids.map((id: string) => (
        <Explore key={id} item={data.entities[id]} handleOnClick={handleOnClick} src={src} />
      ))}
    </Grid>
  );
};

export default Explores;
