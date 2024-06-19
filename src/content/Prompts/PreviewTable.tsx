import { useCallback, useEffect, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import { Container, MenuItem, Paper, Stack, TextField, Tooltip, styled } from '@mui/material';
import { usePathname, useSearchParams } from 'next/navigation';

import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import DataTable from '@/components/DataTable';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import ContentLayout from '@/layouts/ContentLayout';
import { IPreviewPage } from '@/pagesspaces/[wid]/prompts/[pid]';
import { queryHandler } from '@/services';
import { useCreateExploreMutation, useGetPromptPreviewMutation } from '@/store/api/etlApiSlice';
import { generateExplorePayload } from '@/utils/explore-utils';
import { FormStatus } from '@/utils/form-utils';
import { getBaseRoute, isDataEmpty } from '@/utils/lib';
import { TData, TPrompt } from '@/utils/typings.d';
import PromptFilter from '@/content/Prompts/PromptFilter';
import { TPayloadOut, generateOnMountPreviewPayload } from '@/content/Prompts/promptUtils';
import SubmitButton from '@/components/SubmitButton';
import SaveModal from '@/content/Prompts/SaveModal';
import { useUser } from '@/hooks/useUser';

import VButton from '@/components/VButton';
import { redirectToExplores } from '@/utils/router-utils';

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

  const searchParams = useSearchParams();

  const pathname = usePathname();

  // Mutation for creating stream
  const [preview, { isLoading, isSuccess, data, isError, error }] = useGetPromptPreviewMutation();

  const [createObject] = useCreateExploreMutation();

  const { user } = useUser();

  // form state - form can be in any of the states {FormStatus}
  const [status, setStatus] = useState<FormStatus>('empty');
  // const [schemaID, setSchemaID] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [exploreName, setExploreName] = useState<string>('');

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  const schemaID = searchParams.get('schemaID');

  const filters = searchParams.get('filters');

  const timeWindow = searchParams.get('timeWindow');

  const timeGrain = searchParams.get('timeGrain');

  const { time_grain_enabled = false, time_window_enabled = false } = prompt ?? {};

  useEffect(() => {
    if (schemaID) {
      const payload: TPayloadOut = generateOnMountPreviewPayload(schemaID);

      previewPrompt(payload);
    }
  }, [schemaID]);

  const transformFilters = (appliedFilters: any[], filters: any[]) => {
    const combinedFilters = appliedFilters.map((filter) => {
      const correspondingFilter = filters.find((f) => f.display_column === filter.column);
      return {
        ...filter,
        column: correspondingFilter ? correspondingFilter.db_column : filter.column
      };
    });

    return combinedFilters;
  };

  useEffect(() => {
    if (timeWindow || filters || timeGrain) {
      const parsedTimeWindow = time_window_enabled ? (timeWindow ? JSON.parse(timeWindow) : {}) : {};
      const parsedTimeGrain = timeGrain ? JSON.parse(timeGrain) : 'day';
      const parsedFilters = filters ? transformFilters(JSON.parse(filters!), prompt.filters) : [];

      const previewPromptpayload: any = {
        schema_id: schemaID as string,
        time_window: parsedTimeWindow,
        filters: parsedFilters
      };

      if (time_grain_enabled) {
        previewPromptpayload.time_grain = parsedTimeGrain;
      }

      previewPrompt(previewPromptpayload);
    }
  }, [timeWindow, filters, timeGrain]);

  const previewPrompt = useCallback(
    (payload: TPayloadOut) => {
      if (schemaID) {
        preview({ workspaceId: wid, promptId: pid, prompt: payload });
      }
    },
    [schemaID]
  );

  const handleSaveAsExplore = () => {
    setOpenModal(true);
  };

  const handleSave = () => {
    setOpenModal(false);
    const payload = generateExplorePayload(
      wid,
      pid,
      user,
      schemaID as string,
      timeWindow as string,
      timeGrain as string,
      filters as string,
      exploreName,
      prompt
    );

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

  const applyFilters = ({ filters = [] }: { filters: any[] }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('filters', JSON.stringify(filters));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const applyTimeWindowFilters = ({
    timeWindow
  }: {
    timeWindow: {
      label: string;
      range: {
        start: string;
        end: string;
      };
    };
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('timeWindow', JSON.stringify(timeWindow));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const applyTimeGrainFilters = ({ val }: { val: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('timeGrain', JSON.stringify(val.toLowerCase()));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSourceChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (val) {
      params.set('schemaID', val);

      const defaultTimeWindow = {
        label: 'last 7 days',
        range: {
          start: "now() - INTERVAL '7 days'",
          end: 'now()'
        }
      };
      params.set('timeWindow', JSON.stringify(defaultTimeWindow));
      if (prompt.time_grain_enabled) {
        params.set('timeGrain', JSON.stringify('day'));
      }

      params.delete('filters');
    } else {
      params.delete('schemaID');
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const defaultTimeWindow = {
      label: 'last 7 days',
      range: {
        start: "now() - INTERVAL '7 days'",
        end: 'now()'
      }
    };
    params.set('timeWindow', JSON.stringify(defaultTimeWindow));
    if (prompt.time_grain_enabled) {
      params.set('timeGrain', JSON.stringify('day'));
    }

    params.delete('filters');

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Paper variant="elevation">
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
      />

      {/* List of available sources to apply prompt on */}
      <Sources
        schemaID={searchParams.get('schemaID')?.toString() ?? ''}
        schemas={prompt?.schemas ?? []}
        handleOnChange={handleSourceChange}
      />

      {schemaID && (
        <Stack>
          <PromptFilter
            filters={prompt.filters}
            operators={prompt.operators}
            timeGrainEnabled={prompt?.time_grain_enabled ?? false}
            timeGrain={prompt?.time_grain ?? null}
            timeWindowEnabled={prompt?.time_window_enabled ?? false}
            applyFilters={applyFilters}
            applyTimeWindowFilters={applyTimeWindowFilters}
            applyTimeGrainFilters={applyTimeGrainFilters}
            searchParams={{ filters: filters!, timeWindow: timeWindow!, timeGrain: timeGrain! }}
            resetFilters={resetFilters}
          />
          <ContentLayout
            key={`PreviewPage`}
            error={error}
            PageContent={
              <PageContent
                prompt={{
                  data: data,
                  handleSaveAsExplore: handleSaveAsExplore,
                  isLoading: isLoading,
                  status: status,
                  router: router,
                  wid: wid
                }}
              />
            }
            displayComponent={!error && !isLoading && data}
            isLoading={isLoading}
            traceError={false}
          />
        </Stack>
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

const FooterStack = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end'
}));

const PageContent = ({
  prompt
}: {
  prompt: {
    isLoading: boolean;
    status: FormStatus;
    data: TData;
    handleSaveAsExplore: () => void;
    router: NextRouter;
    wid: string;
  };
}) => {
  const { data, isLoading, handleSaveAsExplore, status, router, wid } = prompt;

  const renderComponent = () => {
    if (isDataEmpty(data)) {
      return <ListEmptyComponent description={'No data found for this prompt'} />;
    }
    return <DataTable data={data} />;
  };

  const handleCancel = () => {
    redirectToExplores({ router: router, wid: wid });
  };

  return (
    <>
      {renderComponent()}
      <FooterStack>
        <Stack display={'flex'} direction={'row'} spacing={1}>
          <VButton
            buttonText={'CANCEL'}
            buttonType="submit"
            onClick={handleCancel}
            size="small"
            disabled={false}
            variant="text"
          />
          <SubmitButton
            buttonText={'SAVE AS EXPLORE'}
            data={status === 'success'}
            isFetching={status === 'submitting'}
            disabled={isLoading || status === 'submitting'}
            onClick={handleSaveAsExplore}
            size="small"
          />
        </Stack>
      </FooterStack>
    </>
  );
};
