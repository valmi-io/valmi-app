import { RootState } from '@/store/reducers';
import { AppFlowState } from '@/store/reducers/appFlow';
import { useSelector } from 'react-redux';

export const useWorkspaceId = () => {
  const appState: AppFlowState = useSelector((state: RootState) => state.appFlow);

  const {
    appState: { workspaceId = '' }
  } = appState;

  return {
    workspaceId
  };
};
