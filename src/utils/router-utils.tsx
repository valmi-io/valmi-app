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
    console.log('Redirecting to create connection page');
    router.push(`${getBaseRoute(wid)}/connections/create`);
  }
};
