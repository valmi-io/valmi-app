import { useRouter } from 'next/router';
import { ReactNode, createContext } from 'react';
import { FormObject } from '@/utils/form-utils';
import { TData } from '@/utils/typings.d';
import { ConnectorType } from '@/content/ConnectionFlow/Connectors/ConnectorsList';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import { getSelectedConnectorKey } from '@/utils/connectionFlowUtils';
import { getBaseRoute } from '@/utils/lib';
import { useSearchParams } from 'next/navigation';
import { getSearchParams } from '@/utils/router-utils';

type OAuthContextType = {
  handleOAuthButtonClick: () => void;
  handleOnConfigureButtonClick: () => void;
  isConnectorConfigured: boolean;
  isConfigurationRequired: boolean;
  oAuthProvider: string;
};

const OAuthContext = createContext<OAuthContextType>({} as OAuthContextType);

type Props = {
  children: ReactNode;
};

function OAuthContextProvider({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = getSearchParams(searchParams);

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const { wid = '', mode = 'etl' } = params ?? {};

  console.log('selectedConnector:', selectedConnector);
  console.log('wid:', wid);

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
    let { type = '' } = selectedConnector;

    const connector = type.split('_')[0] ?? '';

    type = type.split('_')[1];

    router.push(`${getBaseRoute(wid as string)}/oauth-apps/${type.toLowerCase()}?connector=${connector.toLowerCase()}`);
  };

  const getOAuthProvider = (oAuthProvider: any) => {
    return oAuthProvider.split('$$')[0];
  };

  const oAuthProvider = (selectedConnector: string) => {
    return getOAuthProvider(selectedConnector);
  };

  const handleOAuthButtonClick = () => {
    alert('Hello');
  };

  return (
    <OAuthContext.Provider
      value={{
        handleOAuthButtonClick,
        handleOnConfigureButtonClick,
        isConnectorConfigured,
        isConfigurationRequired,
        selectedConnector,
        oAuthProvider
      }}
    >
      {children}
    </OAuthContext.Provider>
  );
}

export { OAuthContextProvider, OAuthContext };
