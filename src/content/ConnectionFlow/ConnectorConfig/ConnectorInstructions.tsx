/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 5th 2024, 9:50:11 am
 * Author: Nagendra S @ valmi.io
 */

import Instructions from '@/components/Instructions';
import { getConnectorDocumentationUrl } from '@/content/ConnectionFlow/ConnectorConfig/ConnectorConfigUtils';
import { memo } from 'react';

const ConnectorInstuctions = ({ data, selected_connector }: { data: any; selected_connector: any }) => {
  const connectorDocumentationUrl = data ? getConnectorDocumentationUrl(data) : '';
  const title = 'Connector Documentation';
  const linkText = selected_connector ? selected_connector.display_name : '';
  return (
    <Instructions documentationUrl={connectorDocumentationUrl} title={title} linkText={linkText} type={'connection'} />
  );
};

export default memo(ConnectorInstuctions);
