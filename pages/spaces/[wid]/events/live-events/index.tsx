/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 19th 2024, 8:44:55 am
 * Author: Nagendra S @ valmi.io
 */

/*
 * Live Events Page Component
 * This component represents a page for displaying live events.
 */

import { ReactElement, SyntheticEvent } from 'react';

import { useRouter } from 'next/router';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { getBaseRoute } from '@/utils/lib';
import LiveEventTabs, { eventTypes } from '@/content/Events/LiveEvents/LiveEventTabs';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const LiveEventsPageLayout = () => {
  // Get type from router
  const router = useRouter();

  const { query } = router.query;
  if (!query) return <></>;
  else return <LiveEventsPage type={''} id={''} query={query} />;
};

const LiveEventsPage = ({
  type,
  id,
  query
}: {
  type: string | string[] | undefined;
  id: string | string[] | undefined;
  query: string | string[] | undefined;
}) => {
  const router = useRouter();

  const { workspaceId = null } = useWorkspaceId();

  const handleOnChange = (event: SyntheticEvent, newValue: number) => {
    const type = eventTypes[newValue];

    let queryState = JSON.parse(query as string);

    if (type === 'bulker_batch.all') {
      if (!queryState.viewState.bulker) {
        queryState = {
          ...queryState,
          viewState: {
            ...queryState.viewState,
            bulker: {
              actorId: ''
            }
          }
        };
      }
    } else if (type === 'incoming.all') {
      if (!queryState.viewState.incoming) {
        queryState = {
          ...queryState,

          viewState: {
            ...queryState.viewState,
            incoming: {
              actorId: ''
            }
          }
        };
      }
    }

    queryState['activeView'] = type;

    router.push(
      {
        pathname: `${getBaseRoute(workspaceId!)}/events/live-events`,
        query: { query: JSON.stringify(queryState) }
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <PageLayout pageHeadTitle="LiveEvents" title="Live Events" displayButton={false}>
      <LiveEventTabs state={JSON.parse(query as string)} onChange={handleOnChange} />
    </PageLayout>
  );
};

LiveEventsPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default LiveEventsPageLayout;
