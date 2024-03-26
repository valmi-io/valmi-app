/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 5th 2024, 10:03:44 am
 * Author: Nagendra S @ valmi.io
 */

import Instructions from '@/components/Instructions';
import { memo } from 'react';

type InstructionsProps = {
  data: any; // schema
  type: 'stream' | 'destination' | 'analytics-destination';
  destinationType?: string;
};

const DestinationInstructions = ({ data, type, destinationType }: InstructionsProps) => {
  destinationType = destinationType === 'postgres' ? 'postgresql' : destinationType;
  const documentationUrl =
    type === 'destination'
      ? `https://www.valmi.io/docs/events/destinations/${destinationType}`
      : `https://www.valmi.io/docs/events/sources/shopify`;

  const title = type === 'destination' ? 'Destination warehouses' : type === 'analytics-destination' ?  'Analytics destinations' : 'Streams';

  const linkText = type === 'destination' ? 'destination-warehouses' : type === 'analytics-destination' ?  'analytics-destinations' : 'streams';

  return <Instructions documentationUrl={documentationUrl} title={title} linkText={linkText} type={type} />;
};

export default memo(DestinationInstructions);
