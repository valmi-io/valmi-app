/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 23rd 2024, 3:00:05 pm
 * Author: Nagendra S @ valmi.io
 */

import Instructions from '@/components/Instructions';
import { memo } from 'react';

type InstructionsProps = {
  data: any; // schema
  type: string;
};

const OAuthInstructions = ({ data, type }: InstructionsProps) => {
  // TODO: documentation url changes based on schema.

  const documentationUrl = `https://www.valmi.io/docs/oauth/schema/${type}`;

  const title = 'OAuth Configuration';

  const linkText = `${type} configuration.`;

  return <Instructions documentationUrl={documentationUrl} title={title} linkText={linkText} type={'oauth'} />;
};

export default memo(OAuthInstructions);
