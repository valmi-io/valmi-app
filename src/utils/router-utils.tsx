export const getSearchParams = (params: any) => {
  const searchParams = new URLSearchParams(params.toString());

  const obj: any = {};
  for (const [key, value] of searchParams.entries()) {
    obj[key] = value;
  }

  return obj;
};
