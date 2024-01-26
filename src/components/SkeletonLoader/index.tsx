/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import Skeleton from '@mui/material/Skeleton';
import { SkeletonLayout } from '../Layouts/Layouts';

interface SkeletonLoadingProps {
  loading: boolean;
}

/**
 * Responsible for taking a `loading` prop and rendering `Skeleton`.
 *
 * - Responsible for its inner layout.
 */

const SkeletonLoader = ({ loading }: SkeletonLoadingProps) => {
  if (!loading) return null;
  return (
    <SkeletonLayout>
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} animation="wave" sx={{ my: 4, mx: 1 }} />
      ))}
    </SkeletonLayout>
  );
};

export default SkeletonLoader;
