export const generateAccountPayload = (user: any) => {
  //@ts-ignore
  const { email = '', first_name = '' } = user || {};

  const payload = {
    name: first_name,
    external_id: email,
    profile: '',
    meta_data: {}
  };

  return payload;
};
