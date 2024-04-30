import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@store/reducers';

import ConnectorsList, { ConnectorType } from '@/content/ConnectionFlow/Connectors/ConnectorsList';
import { useRouter } from 'next/router';
import { getBaseRoute } from '@/utils/lib';
import { AppDispatch } from '@/store/store';
import { clearConnectionFlowState, setConnectionFlowState } from '@/store/reducers/connectionDataFlow';
import { getOAuthObjInStore, getSelectedConnectorKey, getSelectedConnectorObj } from '@/utils/connectionFlowUtils';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

interface ConnectorListProps {
  data: any;
}

const ConnectorsPageContent = ({ data }: ConnectorListProps) => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const { workspaceId = null } = useWorkspaceId();

  const handleItemOnClick = (item: ConnectorType) => {
    const { type = '', mode = [] } = item ?? {};

    const params = new URLSearchParams();

    params.set('mode', mode.length > 0 ? mode[0] : '');
    const pathname = `${getBaseRoute(workspaceId)}/connections/create`;

    const key = getSelectedConnectorKey();

    const objToDispatch = {
      ids: [key],
      entities: {
        [key]: { ...getSelectedConnectorObj(item, key), ...getOAuthObjInStore(item) } // initially setting oauth_params, oauth_error to empty in store
      }
    };

    dispatch(setConnectionFlowState(objToDispatch));

    router.push(pathname + '?' + params);
  };

  return <ConnectorsList key={`connectorsList`} data={data} handleItemOnClick={handleItemOnClick} selectedType={''} />;
};

export default ConnectorsPageContent;
