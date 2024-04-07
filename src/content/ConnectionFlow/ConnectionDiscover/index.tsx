import { RootState } from '@/store/reducers';
import { isObjectEmpty } from '@/utils/lib';
import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWizard } from 'react-use-wizard';
import { useLazyDiscoverConnectorQuery } from '@store/api/apiSlice';
import { TConnectionUpsertProps } from '@/pagesspaces/[wid]/connections/create';
import ErrorComponent, { ErrorStatusText } from '@/components/Error';
import { getErrorsInData, hasErrorsInData } from '@/components/Error/ErrorUtils';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import TableHeader from '@/components/Table/TableHeader';
import { TableColumnProps } from '@/utils/table-utils';
import appIcons from '@/utils/icon-utils';
import { TableCellComponent, TableCellWithDropdown, TableCellWithSwitch } from '@/components/Table/TableCellComponent';
import { TData } from '@/utils/typings.d';
import streamsReducer from '@/content/ConnectionFlow/ConnectionDiscover/streamsReducer';
import { setEntities } from '@/store/reducers/connectionDataFlow';
import { AppDispatch } from '@/store/store';

const Columns: TableColumnProps[] = [
  { id: '1', label: '', align: 'right', action: true, minWidth: 100 },
  { id: '2', label: 'Stream', minWidth: 300, icon: appIcons.NAME, muiIcon: true },
  { id: '3', label: 'Sync mode', minWidth: 300, icon: appIcons.SYNC }
];

const initialObjs: TData = {
  ids: [],
  entities: {}
};

const ConnectionDiscover = ({ params }: TConnectionUpsertProps) => {
  const { wid = '', type = '' } = params ?? {};

  const dispatchToStore = useDispatch<AppDispatch>();

  const { activeStep, handleStep } = useWizard();
  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const prevStep = activeStep - 1;

  const config = connectionDataFlow?.entities[prevStep]?.config?.config ?? {};

  const [fetchQuery, { data, isFetching, error }] = useLazyDiscoverConnectorQuery();

  const [traceError, setTraceError] = useState<any>(null);
  const [results, setResults] = useState(null);

  const [state, dispatch] = useReducer(streamsReducer, initialObjs);

  useEffect(() => {
    if (!isObjectEmpty(config)) {
      const payload = {
        config,
        workspaceId: wid,
        connectorType: type,
        queryId: 1
      };

      if (objExistsInStore()) {
        const data = getCurrObjFromStore('discover');

        const streams: any[] = getCurrObjFromStore('streams');

        handleSaveObj(streams);

        setResults(data);
      } else {
        fetchQuery(payload);
      }
    }
  }, [config]);

  useEffect(() => {
    if (data?.resultData) {
      if (hasErrorsInData(data?.resultData)) {
        const traceError = getErrorsInData(data?.resultData);
        setTraceError(traceError);
      } else {
        setResults(data?.resultData);
      }
    }
  }, [data]);

  const objExistsInStore = () => {
    return !!connectionDataFlow?.entities[activeStep];
  };

  const getCurrObjFromStore = (key: string) => {
    return connectionDataFlow?.entities[activeStep][key];
  };

  const handleSaveObj = (objs: any[]) => {
    dispatch({
      type: 'SAVE',
      payload: {
        objs: objs
      }
    });
  };

  const handleAddObj = (event: React.MouseEvent<unknown>, id: string, obj: any) => {
    dispatch({
      type: 'TOGGLE_ADD',
      payload: {
        id: id,
        obj: obj
      }
    });
  };

  const handleSelectAllObjs = (event: React.ChangeEvent<HTMLInputElement>, objs: any[]) => {
    dispatch({
      type: 'TOGGLE_SELECT_ALL',
      payload: {
        checked: event.target.checked,
        objs: objs
      }
    });
  };

  const handleChangeObj = (id: string, value: string) => {
    dispatch({
      type: 'CHANGE',
      payload: {
        id: id,
        value: value
      }
    });
  };

  const isSelected = (id: string) => state.ids.indexOf(id) !== -1;

  handleStep(() => {
    const entitiesInStore = connectionDataFlow?.entities ?? {};

    const { ids = [], entities = {} } = state;

    const streamsArr: any[] = [];

    if (ids.length > 0) {
      ids.forEach((id: any) => {
        streamsArr.push(entities[id]);
      });
    }

    let results = null;
    if (objExistsInStore()) {
      results = getCurrObjFromStore('discover');
    } else {
      results = data?.resultData;
    }

    const obj = {
      ...entitiesInStore,
      [activeStep]: {
        streams: streamsArr,
        discover: results
      }
    };

    dispatchToStore(setEntities(obj));
  });

  const getDisplayComponent = () => {
    if (error) {
      return <ErrorComponent error={error} />;
    }

    if (traceError) {
      return <ErrorStatusText>{traceError}</ErrorStatusText>;
    }

    if (isFetching) {
      return <SkeletonLoader loading={isFetching} />;
    }

    if (results) {
      //@ts-ignore
      const rows = results?.catalog?.streams ?? [];

      return (
        <>
          {/* Connections discover table*/}
          <TableContainer>
            <Table>
              {/* Columns */}
              <TableHead>
                <TableHeader
                  columns={Columns}
                  connectionType={''}
                  onSelectAllClick={(event) => handleSelectAllObjs(event, rows)}
                  numSelected={state.ids.length}
                  rowCount={rows.length ?? 0}
                />
              </TableHead>
              {/* Table Body */}

              <TableBody>
                {rows.map((row: any, index: number) => {
                  const isItemSelected = isSelected(row.name);

                  const labelId = `table-checkbox-${index}`;

                  return (
                    <TableRow hover key={row.id}>
                      <TableCellWithSwitch
                        checked={isItemSelected}
                        onClick={(event, checked) => {
                          handleAddObj(event, row.name, row);
                        }}
                        labelId={labelId}
                      />
                      <TableCellComponent text={row.name} />
                      <TableCellWithDropdown
                        disabled={!isItemSelected}
                        data={row?.supported_sync_modes ?? []}
                        onClick={(event, key) => {
                          handleChangeObj(row.name, event.target.value);
                        }}
                        value={state.entities[row.name]?.sync_mode ?? ''}
                      />
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      );
    }
  };

  return <>{getDisplayComponent()}</>;
};

export default ConnectionDiscover;
