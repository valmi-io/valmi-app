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
  connectionURL: `/api/createOrUpdateConnection`
};

export const redirectToHomePage = (wid: string, router: NextRouter) => {
  if (wid) {
    router.push('/');
  }
};

export const redirectToCreateDataFlow = ({ router, wid }: { router: NextRouter; wid: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/data-flows/create`);
  }
};

export const redirectToEditDataFlow = ({ router, wid }: { router: NextRouter; wid: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/data-flows/edit`);
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
    router.push(`${getBaseRoute(wid)}/data-flows/${connId}/runs`);
  }
};

export const redirectToDataFlowRunLogs = ({
  router,
  wid,
  connId,
  runId,
  connectionType
}: {
  router: NextRouter;
  wid: string;
  connId: string;
  runId: string;
  connectionType: string;
}) => {
  if (wid && connId && runId) {
    router.push({
      pathname: `${getBaseRoute(wid)}/data-flows/${connId}/runs/${runId}/logs`,
      query: { connection_type: connectionType }
    });
  }
};

export const redirectToDataFlowsList = ({ router, wid }: { router: NextRouter; wid: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/data-flows/list`);
  }
};

export const redirectToPromptPreview = ({
  router,
  wid,
  promptId
}: {
  router: NextRouter;
  wid: string;
  promptId: string;
}) => {
  if (wid && promptId) {
    router.push(`${getBaseRoute(wid)}/prompts/${promptId}`);
  }
};

export const redirectToExplores = ({ router, wid }: { router: NextRouter; wid: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/explores`);
  }
};

export const redirectToEvents = ({ router, wid }: { router: NextRouter; wid: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/events`);
  }
};

export const redirectToStreams = ({ router, wid }: { router: NextRouter; wid: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/events/streams`);
  }
};

export const redirectToCreateStream = ({ router, wid }: { router: NextRouter; wid: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/events/streams/create`);
  }
};

export const redirectToDestinationWarehouses = ({ router, wid }: { router: NextRouter; wid: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/events/destination-warehouses`);
  }
};

export const redirectToCreateDestinationWarehouse = ({ router, wid }: { router: NextRouter; wid: string }) => {
  if (wid) {
    router.push(`${getBaseRoute(wid)}/events/destination-warehouses/create`);
  }
};
