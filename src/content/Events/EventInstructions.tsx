/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 5th 2024, 4:17:04 pm
 * Author: Nagendra S @ valmi.io
 */

import Instructions from '@/components/Instructions';
import { memo } from 'react';

const TrackInstructions = ({ data }: { data: any }) => {
  const documentationUrl = 'https://www.valmi.io/docs/overview';
  const title = 'Tracks';
  const linkText = 'tracks.';

  return <Instructions documentationUrl={documentationUrl} title={title} linkText={linkText} type={'track'} />;
};

export default memo(TrackInstructions);
