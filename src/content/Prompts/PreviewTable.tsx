//@S-Nagendra
import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import DataTable from '@/components/DataTable';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import PageTitle from '@/components/PageTitle';
import ContentLayout from '@/layouts/ContentLayout';
import { IPreviewPage } from '@/pagesspaces/[wid]/prompts/[pid]';
import { queryHandler } from '@/services';
import {
  useCreateExploreMutation,
  useGetPromptPreviewMutation,
  useLazyGetPreviewDataQuery
} from '@/store/api/etlApiSlice';
import { generateExplorePayload } from '@/utils/explore-utils';
import { FormStatus } from '@/utils/form-utils';
import { getBaseRoute, isDataEmpty } from '@/utils/lib';
import { TData } from '@/utils/typings.d';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import PromptFilter from '@/content/Prompts/PromptFilter';

const PreviewTable = ({ params }: { params: IPreviewPage }) => {
  const { pid = '', wid = '', filter = '' } = params;

  const router = useRouter();

  // const [preview, { data, isFetching, error }] = useLazyGetPreviewDataQuery();

  // Mutation for creating stream
  const [preview, { isLoading, isSuccess, data, isError, error }] = useGetPromptPreviewMutation();

  const [createObject] = useCreateExploreMutation();

  const { data: session } = useSession();
  const { user = {} } = session ?? {};

  // form state - form can be in any of the states {FormStatus}
  const [status, setStatus] = useState<FormStatus>('empty');

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  useEffect(() => {
    if (pid) {
      getData({});
    }
  }, [pid]);

  // useEffect(() => {
  //   if (filter) {
  //     getData();
  //   }
  // }, [filter]);

  const getData = (data: any) => {
    preview({
      workspaceId: wid,
      promptId: pid,
      prompt: data
    });
  };

  const handleSaveAsExplore = () => {
    setStatus('submitting');
    const payload = generateExplorePayload(wid, pid, user);

    createExploreHandler({ query: createObject, payload: payload });
  };

  const successCb = (data: any) => {
    setStatus('success');
    handleNavigationOnSuccess();
  };

  const errorCb = (error: any) => {
    setStatus('error');
    handleAlertOpen({ message: error, alertType: 'error' as AlertStatus });
  };

  const createExploreHandler = async ({ query, payload }: { query: any; payload: any }) => {
    await queryHandler({ query, payload, successCb, errorCb });
  };

  const handleNavigationOnSuccess = () => {
    router.push(`${getBaseRoute(wid)}/explores`);
  };

  /**
   * Responsible for opening alert dialog.
   */
  const handleAlertOpen = ({ message = '', alertType }: { message: string | any; alertType: AlertStatus }) => {
    setAlertState({
      message: message,
      show: true,
      type: alertType
    });
  };

  /**
   * Responsible for closing alert dialog.
   */
  const handleAlertClose = () => {
    setAlertState({
      message: '',
      show: false,
      type: 'empty'
    });
  };

  const applyFilters = (data: any) => {
    preview({
      workspaceId: wid,
      promptId: pid,
      prompt: data
    });
  };

  return (
    <>
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
      />

      <PageTitle
        title={'Data table'}
        displayButton={false}
        // buttonTitle={'Save as explore'}
        // disabled={isLoading || status === 'submitting'}
        // onClick={handleSaveAsExplore}
        // link={false}
        // isFetching={status === 'submitting'}
        // displayStartIcon={false}
      />

      <PromptFilter applyFilters={applyFilters} />

      <ContentLayout
        key={`PreviewPage`}
        error={error}
        PageContent={<PageContent data={data} />}
        displayComponent={!error && !isLoading && data}
        isLoading={isLoading}
        traceError={false}
      />
    </>
  );
};

export default PreviewTable;

const PageContent = ({ data }: { data: TData }) => {
  console.log('data:_', data);
  return null;
  if (isDataEmpty(data)) {
    return <ListEmptyComponent description={'No data found for this prompt'} />;
  }

  return <DataTable data={data} />;
};
