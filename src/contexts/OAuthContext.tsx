import { useRouter } from 'next/router';
import { ReactNode, createContext } from 'react';
import { FormObject } from '@/utils/form-utils';
import { TData } from '@/utils/typings.d';
import { ConnectorType } from '@/content/ConnectionFlow/Connectors/ConnectorsList';

type OAuthContextType = {
  handleOAuthButtonClick: () => void;
};

const OAuthContext = createContext<OAuthContextType>({} as OAuthContextType);

type Props = {
  children: ReactNode;
};

function OAuthContextProvider({ children }: Props) {
  const router = useRouter();

  const isConfigurationRequired = ({ connector }: { connector: ConnectorType }) => {
    const { oauth_keys = 'private' } = connector;

    return oauth_keys === 'private' ? true : false;
  };

  const isConnectorConfigured = ({ field, keys }: { field: FormObject; keys: TData }) => {
    const { ids = [] } = keys;
    if (field.fieldType !== 'auth') return false;
    return !!ids.length;
  };

  const handleOnConfigureButtonClick = () => {
    let { type = '' } = selected_connector;

    const connector = type.split('_')[0] ?? '';

    type = type.split('_')[1];

    router.push(
      `${getBaseRoute(workspaceId as string)}/oauth-apps/${type.toLowerCase()}?connector=${connector.toLowerCase()}`
    );
  };

  const handleOAuthButtonClick = () => {
    const oAuthRoute = `/api/oauth2/login/shopify`;

    let obj = {
      workspace: '5800ff75bd9b7df5ed21210fa1dddb1f',
      connector: 'shopify',
      oauth_keys: 'public',
      shop: 'test-valmi-app'
    };

    let state = encodeURIComponent(JSON.stringify(obj));

    router.push(`${oAuthRoute}?state=${state}`);
  };

  return <OAuthContext.Provider value={{ handleOAuthButtonClick }}>{children}</OAuthContext.Provider>;
}

export { OAuthContextProvider, OAuthContext };
