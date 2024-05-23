import { AppFlowUserState } from '@/store/reducers/appFlow';

export const generateAccountPayload = (user: AppFlowUserState) => {
  //@ts-ignore
  const { email = '', name = '', image = '' } = user || {};

  const payload = {
    name: name,
    external_id: email,
    profile: image,
    meta_data: {}
  };

  return payload;
};
