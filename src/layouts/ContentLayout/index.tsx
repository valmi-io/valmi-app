/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 3rd 2024, 6:22:01 pm
 * Author: Nagendra S @ valmi.io
 */

import { ErrorStatusText } from '@/components/Error';
import ErrorContainer from '@/components/Error/ErrorContainer';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Grid, Card } from '@mui/material';
import { CSSProperties } from 'react';

interface layoutProps {
  isLoading?: boolean;
  error?: any;
  traceError?: any;
  PageContent: JSX.Element;
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
      <Grid item xs={12}>
        <Card variant={cardVariant ? 'outlined' : undefined} style={cardStyles}>
          {/** Display error */}
          {error && <ErrorContainer error={error} />}

          {/** Display trace error*/}
          {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}

          {/** Display skeleton */}
          <SkeletonLoader loading={isLoading} />

          {/** Display page content */}
          {displayComponent && PageContent && PageContent}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ContentLayout;
