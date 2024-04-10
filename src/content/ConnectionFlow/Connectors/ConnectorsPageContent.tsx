import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@store/reducers';

import ConnectorsList, { ConnectorType } from '@/content/ConnectionFlow/Connectors/ConnectorsList';
import { useRouter } from 'next/router';
import { getBaseRoute } from '@/utils/lib';
import { AppDispatch } from '@/store/store';
import { clearConnectionFlowState, setConnectionFlowState } from '@/store/reducers/connectionDataFlow';
import { getSelectedConnectorKey, getSelectedConnectorObj } from '@/utils/connectionFlowUtils';

interface ConnectorListProps {
  data: any;
}

const ConnectorsPageContent = ({ data }: ConnectorListProps) => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const appState = useSelector((state: RootState) => state.appFlow.appState);

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const { workspaceId } = appState;

  const handleItemOnClick = (item: ConnectorType) => {
    const { type = '', mode = [] } = item ?? {};

    const params = new URLSearchParams();
    // params.set('connectionId', '123456789'); // set this param to enable connection edit flow
    // params.set('type', type);
    params.set('mode', mode.length > 0 ? mode[0] : '');
    const pathname = `${getBaseRoute(workspaceId)}/connections/create`;

    const key = getSelectedConnectorKey();

    console.log('Connection data flow:_', connectionDataFlow);

    const objToDispatch = {
      ids: [key],
      entities: {
        [key]: getSelectedConnectorObj(item, key)
      }
    };

    dispatch(setConnectionFlowState(objToDispatch));

    // dispatch(clearConnectionFlowState());

    router.push(pathname + '?' + params);
  };

  return <ConnectorsList key={`connectorsList`} data={data} handleItemOnClick={handleItemOnClick} selectedType={''} />;
};

export default ConnectorsPageContent;
