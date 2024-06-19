import { RootState } from '@/store/reducers';
import { AppFlowState } from '@/store/reducers/appFlow';
import { useSelector } from 'react-redux';

export const useUser = () => {
  const appState: AppFlowState = useSelector((state: RootState) => state.appFlow);

  const {
    appState: { user, loginFlowState }
  } = appState;

  return {
    user,
    loginFlowState
  };
};
