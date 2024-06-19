/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 3rd 2024, 6:22:01 pm
 * Author: Nagendra S @ valmi.io
 */

import { ErrorStatusText } from '@/components/Error';
import ErrorContainer from '@/components/Error/ErrorContainer';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Grid, Card } from '@mui/material';
import { CSSProperties, ReactNode } from 'react';

interface layoutProps {
  isLoading?: boolean;
  error?: any;
  traceError?: any;
  PageContent: ReactNode;
  displayComponent?: boolean;
  cardStyles?: CSSProperties;
  cardVariant?: boolean;
}

const ContentLayout = ({
  PageContent,
  error,
  isLoading = false,
  traceError,
  displayComponent = false,
  cardStyles,
  cardVariant = true
}: layoutProps) => {
  return (
    <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
      {/** Remove bgColor after removing Grid system */}
      <Grid item xs={12} bgcolor={'transparent'}>
        <Card variant={cardVariant ? 'elevation' : undefined} style={cardStyles} sx={{ bgcolor: 'transparent' }}>
          {/** Display error */}
          {!isLoading && error && <ErrorContainer error={error} />}

          {/** Display trace error*/}
          {!isLoading && traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

          {/** Display skeleton */}
          <SkeletonLoader loading={isLoading} />

          {/** Display page content */}
          {displayComponent && PageContent}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ContentLayout;
