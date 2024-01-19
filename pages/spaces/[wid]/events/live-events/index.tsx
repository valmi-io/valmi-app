/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 19th 2024, 8:44:55 am
 * Author: Nagendra S @ valmi.io
 */

/*
 * Live Events Page Component
 * This component represents a page for displaying live events.
 */

import { ReactElement, useState } from 'react';

import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { RootState } from '@store/reducers';
import { useGetLogsQuery } from '@/store/api/streamApiSlice';
import { useFetch } from '@/hooks/useFetch';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { copy, isDataEmpty } from '@/utils/lib';
import ContentLayout from '@/layouts/ContentLayout';
import { AppState } from '@/store/store';
import Modal from '@/components/Modal';
import IncomingEventsTable from '@/content/Events/LiveEvents/IncomingEventsTable';
import BulkerEventsTable from '@/content/Events/LiveEvents/BulkerEventsTable';

const LiveEventsPageLayout = () => {
  // Get type from router
  const router = useRouter();
  const { type, id } = router.query;
  if (!type && !id) return <></>;
  else return <LiveEventsPage type={type} id={id} />;
};

const LiveEventsPage = ({ type, id }: { type: string | string[] | undefined; id: string | string[] | undefined }) => {
  const appState: AppState = useSelector((state: RootState) => state.appFlow.appState);

  const { workspaceId = '' } = appState;

  const { data, isLoading, traceError, error } = useFetch({
    query: useGetLogsQuery({ workspaceId: workspaceId, eventType: type, eventId: id })
  });

  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleRowOnClick = ({ data }: any) => {
    //@ts-ignore

    setSelectedRowData(data, null, 2);
    setCopied(false);
    setDialogOpen(true);
  };

  const handleCopyToClipboard = () => {
    if (selectedRowData) {
      setCopied(true);
      copy(selectedRowData);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const PageContent = () => {
    if (isDataEmpty(data)) {
      return <ListEmptyComponent description={'No data.'} />;
    } else if (type === 'incoming.all') {
      return <IncomingEventsTable key={`incomingEventsTable-${id}`} data={data} onRowClick={handleRowOnClick} />;
    } else if (type === 'bulker_batch.all') {
      return <BulkerEventsTable key={`bulkerEventsTable-${id}`} data={data} onRowClick={handleRowOnClick} />;
    }
  };

  return (
    <PageLayout pageHeadTitle="LiveEvents" title="Live Events" displayButton={false}>
      <ContentLayout
        key={`liveEventsPage-${workspaceId}-${type}`}
        error={error}
        PageContent={<PageContent />}
        displayComponent={!error && !isLoading && data}
        isLoading={isLoading}
        traceError={traceError}
      />
      <Modal
        title="Event Details"
        open={isDialogOpen}
        onClose={handleCloseDialog}
        handleCopy={handleCopyToClipboard}
        data={JSON.parse(selectedRowData)}
        copy={true}
        isCopied={copied}
      />
    </PageLayout>
  );
};

LiveEventsPageLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default LiveEventsPageLayout;
