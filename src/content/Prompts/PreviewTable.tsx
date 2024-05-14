//@S-Nagendra
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
import { TData } from '@/utils/typings.d';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import PromptFilter from '@/content/Prompts/PromptFilter';
import { Paper } from '@mui/material';
import moment from 'moment';
import { TPromptSource } from '@/content/Prompts/Prompt';
import { TPayloadOut, generatePreviewPayload } from '@/content/Prompts/promptUtils';

const PreviewTable = ({ params, sources }: { params: IPreviewPage; sources: TPromptSource[] }) => {
  const { pid = '', wid = '', filter = '' } = params;

  console.log('Preview table sources:_', sources);

  const router = useRouter();

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
      const payload: TPayloadOut = generatePreviewPayload({
        sources,
        filters: [],
        time_window: {
          label: 'custom',
          range: {
            // 1 month range
            start: moment().subtract(1, 'months').toISOString(),
            end: moment().toISOString()
          }
        }
      });

      console.log('initialData: ', payload);
      previewPrompt(payload);
    }
  }, [pid]);

  // useEffect(() => {
  //   if (filter) {
  //     getData();
  //   }
  // }, [filter]);

  const previewPrompt = (payload: TPayloadOut) => {
    preview({
      workspaceId: wid,
      promptId: pid,
      prompt: payload
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

  const applyFilters = (payload: any) => {
    payload.source_id = sources[0].id;

    previewPrompt(payload);
  };

  return (
    <Paper variant="outlined">
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
      />

      <PromptFilter spec={''} applyFilters={applyFilters} />

      <ContentLayout
        key={`PreviewPage`}
        error={error}
        PageContent={<PageContent data={data} />}
        displayComponent={!error && !isLoading && data}
        isLoading={isLoading}
        traceError={false}
      />
    </Paper>
  );
};

export default PreviewTable;

const PageContent = ({ data }: { data: TData }) => {
  console.log('data:_', data);

  if (isDataEmpty(data)) {
    return <ListEmptyComponent description={'No data found for this prompt'} />;
  }

  return <DataTable data={data} />;
};

// import * as React from 'react';
// import { DataGrid, GridColDef, GridFilterModel, GridToolbar } from '@mui/x-data-grid';
// import { useDemoData } from '@mui/x-data-grid-generator';

// const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

// const PreviewTable = () => {
//   const { data } = useDemoData({
//     dataSet: 'Employee',
//     visibleFields: VISIBLE_FIELDS,
//     rowLength: 100
//   });

//   const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
//     items: [
//       {
//         field: 'rating',
//         operator: '>',
//         value: '2.5'
//       }
//     ]
//   });

//   const columns: GridColDef<typeof rows[number]>[] = [
//     { field: 'id', headerName: 'ID', width: 90 },
//     {
//       field: 'firstName',
//       headerName: 'First name',
//       width: 150,
//       editable: true
//     },
//     {
//       field: 'lastName',
//       headerName: 'Last name',
//       width: 150,
//       editable: true
//     },
//     {
//       field: 'age',
//       headerName: 'Age',
//       type: 'number',
//       width: 110,
//       editable: true
//     },
//     {
//       field: 'fullName',
//       headerName: 'Full name',
//       description: 'This column has a value getter and is not sortable.',
//       sortable: false,
//       width: 160,
//       valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`
//     }
//   ];

//   const rows = [
//     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
//     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
//     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
//     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
//     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
//   ];

//   return (
// <div style={{ height: 400, width: '100%' }}>
//   <DataGrid
//     rows={rows}
//     columns={columns}
//     slots={{
//       toolbar: GridToolbar
//     }}
//     // filterModel={filterModel}
//     onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
//   />
// </div>
//   );
// };

// export default PreviewTable;
