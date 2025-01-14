import Instructions from '@/components/Instructions';
import { getConnectorDocumentationUrl } from '@/content/ConnectionFlow/ConnectionConfig/ConnectionConfigUtils';
import { memo } from 'react';

const CatalogInstuctions = ({ data, selected_connector }: { data: any; selected_connector: any }) => {
  const connectorDocumentationUrl = data ? getConnectorDocumentationUrl(data) : '';

  const segments = connectorDocumentationUrl.split('/'); // Split the URL by "/"
  const name = segments.at(-1); // Get the last segment

  const connectorType = segments.at(-2);

  const documentationUrl = `https://www.valmi.io/docs/integrations/${connectorType}/${name}`;

  const title = 'INSTRUCTIONS';
  const linkText = selected_connector ? selected_connector.display_name : '';

  return <Instructions documentationUrl={documentationUrl} title={title} linkText={linkText} type={'credential'} />;
};

export default memo(CatalogInstuctions);
