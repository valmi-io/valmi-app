/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 5th 2024, 10:03:44 am
 * Author: Nagendra S @ valmi.io
 */

import Instructions from '@/components/Instructions';
import { memo } from 'react';

type InstructionsProps = {
  data: any; // schema
  type: 'stream' | 'destination';
};

const DestinationInstructions = ({ data, type }: InstructionsProps) => {
  // TODO: documentation url changes based on schema.
  const documentationUrl = data ? 'https://www.valmi.io/docs/overview' : 'https://www.valmi.io/docs/overview';

  const title = type === 'destination' ? 'Destination warehouses' : 'Streams';

  const linkText = type === 'destination' ? 'Destination-warehouses' : 'streams.';

  return <Instructions documentationUrl={documentationUrl} title={title} linkText={linkText} type={type} />;
};

export default memo(DestinationInstructions);
