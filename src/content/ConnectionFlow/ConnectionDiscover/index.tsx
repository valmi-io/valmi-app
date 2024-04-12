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
import { Table, TableBody, TableCell, TableContainer, TableHead, Typography } from '@mui/material';
import TableHeader from '@/components/Table/TableHeader';
import { TableColumnProps } from '@/utils/table-utils';
import appIcons from '@/utils/icon-utils';
import { TableCellComponent, TableCellWithDropdown, TableCellWithSwitch } from '@/components/Table/TableCellComponent';
import { TData } from '@/utils/typings.d';
import streamsReducer from '@/content/ConnectionFlow/ConnectionDiscover/streamsReducer';
import { setEntities } from '@/store/reducers/connectionDataFlow';
import { AppDispatch } from '@/store/store';
import { WizardFooter } from '@/components/Wizard/Footer';
import { CustomizedTableRow } from '@/content/Syncs/SyncRunLogs/SyncRunLogsTable';
import { getCatalogObjKey, getCredentialObjKey, getSelectedConnectorKey } from '@/utils/connectionFlowUtils';

const Columns: TableColumnProps[] = [
  { id: '1', label: '', align: 'right', action: true, checkBox: true, minWidth: 100 },
  { id: '2', label: 'Stream', minWidth: 300, icon: appIcons.NAME, muiIcon: true },
  { id: '3', label: 'Sync mode', minWidth: 300, icon: appIcons.SYNC },
  { id: '4', label: '', minWidth: 300, icon: appIcons.ETL_ICON }
];

const initialObjs: TData = {
  ids: [],
  entities: {}
};

const ConnectionDiscover = ({ params, isEditableFlow = false }: TConnectionUpsertProps) => {
  const { wid = '', mode = 'etl' } = params ?? {};

  const dispatchToStore = useDispatch<AppDispatch>();

  const { handleStep, nextStep, previousStep } = useWizard();

  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const { type = '' } = selectedConnector;

  const config = connectionDataFlow?.entities[getCredentialObjKey(type)]?.config ?? {};

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

      if (objExistsInStore() && hasCatalogObj()) {
        const data = getCurrObjFromStore('catalog');

        const streams: any[] = getCurrObjFromStore('streams');

        handleSaveObj(streams);

        setResults(data);
      } else {
        if (!isEditableFlow) {
          handleSaveObj([]);
        } else {
          const streams: any[] = getCurrObjFromStore('streams');
          handleSaveObj(streams);
        }

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
    return !!connectionDataFlow?.entities[getCatalogObjKey(type)];
  };

  const getCurrObjFromStore = (key: string) => {
    return connectionDataFlow?.entities[getCatalogObjKey(type)][key];
  };

  const hasCatalogObj = () => {
    const key = 'catalog';
    return !!connectionDataFlow?.entities[getCatalogObjKey(type)].hasOwnProperty(key);
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

    if (objExistsInStore() && hasCatalogObj()) {
      results = getCurrObjFromStore('catalog');
    } else {
      results = data?.resultData;
    }

    const obj = {
      ...entitiesInStore,
      [getCatalogObjKey(type)]: {
        streams: streamsArr,
        catalog: results
      }
    };

    dispatchToStore(setEntities(obj));
  });

  const getSourceCursorField = (row: any) => {
    return row?.source_defined_cursor && row?.default_cursor_field ? row.default_cursor_field[0] : '';
  };

  const getSourcePrimaryKey = (row: any) => {
    return row?.source_defined_primary_key ? row?.source_defined_primary_key[0] : '';
  };

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

                  let cursorField = '';
                  let primaryKey = '';

                  if (mode === 'etl') {
                    cursorField = getSourceCursorField(row);
                    primaryKey = getSourcePrimaryKey(row);
                  }

                  return (
                    <CustomizedTableRow key={`obj_key ${index}`} hover>
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
                      <TableCell>
                        <Typography variant="body2" color="text.primary" noWrap>
                          {`cursorField - ${cursorField}`}
                        </Typography>
                        <Typography variant="body2" color="text.primary" noWrap>
                          {`primaryKey - ${primaryKey}`}
                        </Typography>
                      </TableCell>
                    </CustomizedTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      );
    }
  };

  return (
    <>
      {getDisplayComponent()}
      <WizardFooter
        disabled={isFetching || state.ids.length < 1}
        prevDisabled={isFetching}
        nextButtonTitle={'Next'}
        onNextClick={() => nextStep()}
        onPrevClick={() => previousStep()}
      />
    </>
  );
};

export default ConnectionDiscover;
