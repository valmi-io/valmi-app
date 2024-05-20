// @ts-nocheck
import { useRouter } from 'next/router';
import { ReactNode, createContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import { getSelectedConnectorKey, getShopifyIntegrationType } from '@/utils/connectionFlowUtils';
import { getBaseRoute } from '@/utils/lib';
import { useSearchParams } from 'next/navigation';
import { getSearchParams } from '@/utils/router-utils';
import { getOauthRoute } from '@/content/ConnectionFlow/ConnectionConfig/ConnectionConfigUtils';
import { setEntities } from '@/store/reducers/connectionDataFlow';

type OAuthContextType = {
  handleOAuthButtonClick: () => void;
  handleOnConfigureButtonClick: () => void;
  oAuthProvider: string;
  selectedConnector: object;
  formState: any;
  setFormState: any;
};

const OAuthContext = createContext<OAuthContextType>({} as OAuthContextType);

type Props = {
  children: ReactNode;
};

function OAuthContextProvider({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const params = getSearchParams(searchParams);

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const entitiesInStore = connectionDataFlow?.entities ?? {};

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  let { oauth_keys = 'private', type = '' } = selectedConnector;

  const { wid = '' } = params ?? {};

  let initialData = {};
  if (type === getShopifyIntegrationType()) {
    initialData = {
      credentials: {
        auth_method: 'api_password'
      }
    };
  }

  const [formState, setFormState] = useState(initialData);

  const [isoAuthStepDone, setIsOAuthStepDone] = useState(false);

  const handleOnConfigureButtonClick = () => {
    let { type = '' } = selectedConnector;

    const connector = type.split('_')[0] ?? '';

    type = type.split('_')[1];

    router.push(`${getBaseRoute(wid as string)}/oauth-apps/${type.toLowerCase()}?connector=${connector.toLowerCase()}`);
  };

  const handleOAuthButtonClick = () => {
    type = type.split('_')[1].toLowerCase(); // shopify | facebook

    const oAuthRoute = getOauthRoute({ oAuth: type });
    if (oAuthRoute) {
      let { type = '' } = selectedConnector;

      let meta = {}; // pass any additional data required for oAuth step and access at server side

      if (type === 'SRC_SHOPIFY') {
        meta = {
          ...meta,
          shop: formState?.shop || '',
          scope: ['read_orders', 'read_products', 'write_products']
        };
      }

      let obj = {
        workspace: wid,
        connector: type,
        oauth_keys: oauth_keys,
        meta: meta
      };

      let state = encodeURIComponent(JSON.stringify(obj));

      const entities = {
        ...entitiesInStore,
        [getSelectedConnectorKey()]: {
          ...connectionDataFlow.entities[getSelectedConnectorKey()],
          formValues: {
            ...formState
          }
        }
      };
      dispatch(setEntities(entities));

      router.push(`${oAuthRoute}?state=${state}`);
    }
  };

  return (
    <OAuthContext.Provider
      value={{
        handleOAuthButtonClick,
        handleOnConfigureButtonClick,
        formState,
        setFormState
      }}
    >
      {children}
    </OAuthContext.Provider>
  );
}

export { OAuthContextProvider, OAuthContext };
