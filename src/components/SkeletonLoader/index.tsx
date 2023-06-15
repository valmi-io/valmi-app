/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import Skeleton from '@mui/material/Skeleton';

const SkeletonLoader = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} animation="wave" sx={{ my: 4, mx: 1 }} />
      ))}
    </>
  );
};

export default SkeletonLoader;
