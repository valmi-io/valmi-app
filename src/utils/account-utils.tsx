export const generateAccountPayload = (user: any) => {
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
