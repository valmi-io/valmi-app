/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

/*
 * Tracks Page Component
 * This component represents a page for displaying tracks and creating new track.
 */

import { ReactElement } from 'react';

import { IconButton } from '@mui/material';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { NextPageWithLayout } from '@/pages_app';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

import { RootState } from '@store/reducers';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { useFetch } from '@/hooks/useFetch';
import { useGetLinksQuery } from '@/store/api/streamApiSlice';
import { setTrackFlowState } from '@/store/reducers/trackFlow';
import appIcons from '@/utils/icon-utils';
import { getBaseRoute, isDataEmpty } from '@/utils/lib';
import CustomIcon from '@/components/Icon/CustomIcon';
import ContentLayout from '@/layouts/ContentLayout';

const TracksPage: NextPageWithLayout = () => {
  const router = useRouter();

  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const dispatch = useDispatch();

  const { workspaceId = '' } = appState;

  const { data, isLoading, traceError, error } = useFetch({ query: useGetLinksQuery(workspaceId) });

  const handleCreateWarehouseOnClick = ({ edit = false, id = '' }) => {
    dispatch(setTrackFlowState({ editing: edit, id: id }));
    router.push(`${getBaseRoute(workspaceId)}/tracks/create`);
  };

  const PageContent = () => {
    if (isDataEmpty(data)) {
      return <ListEmptyComponent description={'No tracks found in this workspace'} />;
    }
    return (
      <>
        {(data.ids as string[]).map((id) => {
          return (
            <div key={id}>
              {data.entities[id].fromId}
              <br />
              {data.entities[id].toId}
              <IconButton
                onClick={() => {
                  handleCreateWarehouseOnClick({ edit: true, id: id });
                }}
              >
                <CustomIcon icon={appIcons.EDIT} />
              </IconButton>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <PageLayout
      pageHeadTitle="Tracks"
      title="Tracks"
      buttonTitle="Track"
      handleButtonOnClick={() => handleCreateWarehouseOnClick({ edit: false, id: '' })}
    >
      <ContentLayout
        key={`tracksPage`}
        error={error}
        PageContent={<PageContent />}
        displayComponent={!error && !isLoading && data}
        isLoading={isLoading}
        traceError={traceError}
      />
    </PageLayout>
  );
};

TracksPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default TracksPage;
