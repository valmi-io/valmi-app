import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import DataTable from '@/components/DataTable';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import ContentLayout from '@/layouts/ContentLayout';
import { IPreviewPage } from '@/pagesspaces/[wid]/prompts/[pid]';
import { queryHandler } from '@/services';
import { useCreateExploreMutation, useGetPromptPreviewMutation } from '@/store/api/etlApiSlice';
import { generateExplorePayload } from '@/utils/explore-utils';
import { FormStatus } from '@/utils/form-utils';
import { getBaseRoute, isDataEmpty, isObjectEmpty } from '@/utils/lib';
import { TData, TPrompt } from '@/utils/typings.d';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import PromptFilter from '@/content/Prompts/PromptFilter';
import { Container, MenuItem, Paper, TextField, Tooltip } from '@mui/material';
import { TPayloadOut, generateOnMountPreviewPayload } from '@/content/Prompts/promptUtils';
import SubmitButton from '@/components/SubmitButton';
import SaveModal from '@/content/Prompts/SaveModal';
import { useUser } from '@/hooks/useUser';

const Sources = ({
  schemaID,
  handleOnChange,
  schemas = []
}: {
  schemaID: string;
  handleOnChange: (value: any) => void;
  schemas: any;
}) => {
  return (
    <Tooltip title={'Select the source to apply this prompt on'} placement="top-start">
      <TextField
        size="small"
        label="Sources"
        select={true}
        required={true}
        value={schemaID}
        onChange={(event) => handleOnChange(event.target.value)}
        InputLabelProps={{
          shrink: true
        }}
        sx={{ width: '50%' }}
      >
        {schemas?.map(({ id, sources }: { id: string; sources: any }) => {
          console.log('id:_', id);
          return (
            <MenuItem key={id} value={id}>
              {sources[0]?.name}
            </MenuItem>
          );
        })}
      </TextField>
    </Tooltip>
  );
};

const PreviewTable = ({ params, prompt }: { params: IPreviewPage; prompt: TPrompt }) => {
  const { pid = '', wid = '', query = '' } = params;

  const router = useRouter();

  // Mutation for creating stream
  const [preview, { isLoading, isSuccess, data, isError, error }] = useGetPromptPreviewMutation();

  const [createObject] = useCreateExploreMutation();

  const { data: session } = useSession();
  // const { user = {} } = session ?? {};
  const { user } = useUser();

  // form state - form can be in any of the states {FormStatus}
  const [status, setStatus] = useState<FormStatus>('empty');
  const [schemaID, setSchemaID] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [exploreName, setExploreName] = useState<string>('');

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  // useEffect(() => {
  //   if (pid && schemaID) {
  //     const payload: TPayloadOut = generateOnMountPreviewPayload(schemaID);

  //     previewPrompt(payload);
  //   }
  // }, [pid, schemaID]);

  useEffect(() => {
    if (router.query && !isObjectEmpty(router.query)) {
      console.log('router query.............', router.query);
      if (query) {
        let queryState = JSON.parse(query as string);
        console.log('Schema id...........', queryState?.schemaId);

        const newSchemaId = queryState?.schemaId ?? '';

        setSchemaID(newSchemaId);

        const payload: TPayloadOut = generateOnMountPreviewPayload(schemaID);

        preview({ workspaceId: wid, promptId: pid, prompt: payload });
      }
    }
  }, [router.query]);

  const previewPrompt = useCallback(
    (payload: TPayloadOut) => {
      console.log('payload', { workspaceId: wid, promptId: pid, prompt: payload });
      preview({ workspaceId: wid, promptId: pid, prompt: payload });
    },
    [schemaID]
  );

  const handleSaveAsExplore = () => {
    setOpenModal(true);
  };

  const handleSave = () => {
    setOpenModal(false);
    const payload = generateExplorePayload(wid, pid, user, schemaID, exploreName, []);
    setStatus('submitting');
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

  const applyFilters = (payload: any, dateRange: string, start_date: any, end_date: any) => {
    const { schemas = [] } = prompt;
    previewPrompt({
      schema_id: schemaID,
      time_window: {
        label: dateRange,
        range: {
          start: start_date,
          end: end_date
        }
      },
      filters: payload
    });
  };

  const handleOnChange = (val: string) => {
    console.log('handle on change:_', val);

    let queryState = {};

    if (query) {
      queryState = JSON.parse(query as string);
    }

    console.log('query state: val_', queryState?.schemaId);

    queryState = {
      schemaId: val
    };

    setSchemaID(val);

    // if (type === 'bulker_batch.all') {
    //   if (!queryState.viewState.bulker) {
    //     queryState = {
    //       ...queryState,
    //       viewState: {
    //         ...queryState.viewState,
    //         bulker: {
    //           actorId: ''
    //         }
    //       }
    //     };
    //   }
    // } else if (type === 'incoming.all') {
    //   if (!queryState.viewState.incoming) {
    //     queryState = {
    //       ...queryState,

    //       viewState: {
    //         ...queryState.viewState,
    //         incoming: {
    //           actorId: ''
    //         }
    //       }
    //     };
    //   }
    // }

    // queryState['activeView'] = type;

    router.push(
      {
        pathname: `${getBaseRoute(wid)}/prompts/${pid}`,
        query: { query: JSON.stringify(queryState) }
      },
      undefined,
      { shallow: true }
    );
  };

  console.log('prompt:_', prompt);

  return (
    <Paper variant="elevation">
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
      />

      {/* List of available sources to apply prompt on */}
      <Sources schemaID={schemaID} schemas={prompt?.schemas ?? []} handleOnChange={handleOnChange} />

      {schemaID && (
        <Container>
          <PromptFilter filters={prompt.filters} operators={prompt.operators} applyFilters={applyFilters} />
          <ContentLayout
            key={`PreviewPage`}
            error={error}
            PageContent={
              <PageContent
                prompt={{ data: data, handleSaveAsExplore: handleSaveAsExplore, isLoading: isLoading, status: status }}
              />
            }
            displayComponent={!error && !isLoading && data}
            isLoading={isLoading}
            traceError={false}
          />
        </Container>
      )}
      <SaveModal
        Title={'Save Explore as'}
        Description="test description"
        exploreName={exploreName}
        setExploreName={setExploreName}
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleSaveExplore={handleSave}
      />
    </Paper>
  );
};

export default PreviewTable;

const PageContent = ({
  prompt
}: {
  prompt: {
    isLoading: boolean;
    status: FormStatus;
    data: TData;
    handleSaveAsExplore: () => void;
  };
}) => {
  const { data, isLoading, handleSaveAsExplore, status } = prompt;

  if (isDataEmpty(data)) {
    return (
      <>
        <ListEmptyComponent description={'No data found for this prompt'} />
        <SubmitButton
          buttonText={'Save as explore'}
          data={status === 'success'}
          isFetching={status === 'submitting'}
          disabled={isLoading || status === 'submitting'}
          onClick={handleSaveAsExplore}
        />
      </>
    );
  }

  return (
    <>
      <DataTable data={data} />
      <SubmitButton
        buttonText={'Save as explore'}
        data={status === 'success'}
        isFetching={status === 'submitting'}
        disabled={isLoading || status === 'submitting'}
        onClick={handleSaveAsExplore}
      />
    </>
  );
};
