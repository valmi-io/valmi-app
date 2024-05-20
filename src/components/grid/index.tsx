import { FC, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';

interface GridLayoutProps {
  children?: ReactNode;
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center'
}));

const GridLayout: FC<GridLayoutProps> = ({ children }) => {
  return (
    <>
      <Paper
        sx={{
          width: '100%',
          height: '100%',
          paddingX: (theme) => theme.spacing(8),
          position: 'relative',
          border: '2px solid black'
        }}
      >
        <Grid container spacing={{ md: 2, xs: 2 }} sx={{ width: '100%', maxWidth: '1200px', height: '100%' }}>
          {Array.from(Array(12)).map((_, index) => (
            <Grid item xs={1} key={index} height="100%">
              <Item sx={{ height: '100%', bgcolor: 'orange' }}>{index}</Item>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Paper sx={{ position: 'absolute', left: 130, right: 130, top: 180 }}>{children}</Paper>
    </>
  );
};
GridLayout.propTypes = {
  children: PropTypes.node
};

export default GridLayout;
