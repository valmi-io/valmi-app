import { RootState } from '@/store/reducers';
import { isObjectEmpty } from '@/utils/lib';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useWizard } from 'react-use-wizard';
import { useLazyDiscoverConnectorQuery } from '@store/api/apiSlice';
import { TConnectionUpsertProps } from '@/pagesspaces/[wid]/connections/create';
import ConnectorLayout from '@/layouts/ConnectorLayout';
import ErrorComponent, { ErrorStatusText } from '@/components/Error';
import { getErrorsInData, hasErrorsInData } from '@/components/Error/ErrorUtils';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Stack, Switch } from '@mui/material';

const ConnectionDiscover = ({ params }: TConnectionUpsertProps) => {
  const { wid = '', type = '' } = params ?? {};

  const { activeStep } = useWizard();
  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const prevStep = activeStep - 1;

  const config = connectionDataFlow?.entities[prevStep]?.config?.config ?? {};

  const [fetchQuery, { data, isFetching, error }] = useLazyDiscoverConnectorQuery();

  const [traceError, setTraceError] = useState<any>(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!isObjectEmpty(config)) {
      const payload = {
        config,
        workspaceId: wid,
        connectorType: type,
        queryId: 1
      };

      fetchQuery(payload);
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
      return results?.catalog?.streams.map((stream) => {
        return (
          <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Switch
              size="medium"
              checked={true}
              onChange={(event, checked) => {
                // handleSyncSwitch(event, checked, syncData);
              }}
            />
            <p>{stream.name}</p>
          </Stack>
        );
      });
    }
  };

  return <ConnectorLayout title={`Select objects`}>{getDisplayComponent()}</ConnectorLayout>;
};

export default ConnectionDiscover;
