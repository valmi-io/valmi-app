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
  fbTokenURL: '/api/getFbLongLivedToken',
  proxyURL: `/api/proxyApiRequest`
};

export const redirectToHomePage = (wid: string, router: NextRouter) => {
  if (wid) {
    router.push('/');
  }
};

export const redirectToCreateConnection = ({ router, wid }: { router: NextRouter; wid: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/data-flows/create`);
  }
};

export const redirectToCredentials = ({ router, wid, type }: { router: NextRouter; wid: string; type: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/catalog/credentials?type=${type}`);
  }
};

export const redirectToDataFlows = ({ router, wid }: { router: NextRouter; wid: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/data-flows`);
  }
};

export const redirectToConnectionRuns = ({
  router,
  wid,
  connId
}: {
  router: NextRouter;
  wid: string;
  connId: string;
}) => {
  if (wid && connId) {
    router.push(`${getBaseRoute(wid)}/data-flows/connections/${connId}/runs`);
  }
};

export const redirectToConnectionRunLogs = ({
  router,
  wid,
  connId,
  runId
}: {
  router: NextRouter;
  wid: string;
  connId: string;
  runId: string;
}) => {
  if (wid && connId && runId) {
    router.push(`${getBaseRoute(wid)}/data-flows/connections/${connId}/runs/${runId}/logs`);
  }
};

export const redirectToCredentials = ({ router, wid, type }: { router: NextRouter; wid: string; type: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/catalog/credentials?type=${type}`);
  }
};
