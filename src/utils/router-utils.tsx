import { getBaseRoute } from '@/utils/lib';
import { NextRouter } from 'next/router';

export const getSearchParams = (params: any) => {
  const searchParams = new URLSearchParams(params.toString());

  const obj: any = {};
  for (const [key, value] of searchParams.entries()) {
    obj[key] = value;
  }

  return obj;
};

export const apiRoutes = {
  checkURL: `/api/checkConnection`,
  defaultURL: `/`,
  fbTokenURL: '/api/getFbLongLivedToken'
};

export const redirectToHomePage = (wid: string, router: NextRouter) => {
  if (wid) {
    router.push('/');
  }
};

export const redirectToCreateConnection = ({ router, wid }: { router: NextRouter; wid: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/connections/create`);
  }
};

export const redirectToCredentials = ({ router, wid, type }: { router: NextRouter; wid: string; type: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/catalog/credentials?type=${type}`);
  }
};
