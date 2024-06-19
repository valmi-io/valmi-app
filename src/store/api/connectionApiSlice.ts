//@ts-nocheck
import { apiSlice } from '@/store/api/apiSlice';

export const connectionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createDefaultWarehouseConnection: builder.query({
      async queryFn(arg, queryApi, extraOptions, baseQuery) {
        const { connectionPayload, workspaceId } = arg;

        const result = await baseQuery({
          url: `workspaces/${workspaceId}/syncs/create_with_defaults`,
          method: 'POST',
          body: connectionPayload
        });

        return result.data ? { data: result.data } : { error: result.error };
      }
    }),

    createConnection: builder.query({
      async queryFn(arg, queryApi, extraOptions, baseQuery) {
        const { credentialPayload, connectionPayload, destCredentialPayload, workspaceId } = arg;

        const { src, dest, schedule, uiState, connectionName } = connectionPayload;

        const credRes = await baseQuery({
          url: `/workspaces/${workspaceId}/credentials/create`,
          method: 'POST',
          body: credentialPayload
        });

        if (credRes.error) return { error: credRes.error };

        const { id: credentialId, name: credentialName } = credRes.data;

        const destStorageCredRes = await baseQuery({
          url: `/workspaces/${workspaceId}/storage-credentials`,
          method: 'GET'
        });

        if (destStorageCredRes.error) return { error: destStorageCredRes.error };

        let destCredObj = {
          ...destCredentialPayload,
          ['connector_config']: destStorageCredRes.data,
          ['name']: 'Postgres'
        };

        const destCredRes = await baseQuery({
          url: `/workspaces/${workspaceId}/credentials/create`,
          method: 'POST',
          body: destCredObj
        });

        if (destCredRes.error) return { error: destCredRes.error };

        const { id: destCredentialId, name: destCredentialName } = destCredRes.data;

        let srcObj = {
          credential_id: credentialId,
          name: credentialName
        };

        let srcPayload = { ...src, ...srcObj };

        const sourceRes = await baseQuery({
          url: `/workspaces/${workspaceId}/sources/create`,
          method: 'POST',
          body: srcPayload
        });

        if (sourceRes.error) return { error: sourceRes.error };

        const { id: sourceId } = sourceRes.data;

        let destObj = {
          credential_id: destCredentialId,
          name: destCredentialName
        };

        let destPayload = { ...dest, ...destObj };

        const destRes = await baseQuery({
          url: `/workspaces/${workspaceId}/destinations/create`,
          method: 'POST',
          body: destPayload
        });

        if (destRes.error) return { error: destRes.error };

        const { id: destinationId } = destRes.data;

        const connPayload = {
          name: connectionName,
          source_id: sourceId,
          destination_id: destinationId,
          ui_state: uiState,
          schedule,
          mode: 'etl'
        };

        const createConnection = await baseQuery({
          url: `/workspaces/${workspaceId}/syncs/create`,
          method: 'POST',
          body: connPayload
        });

        return createConnection.data ? { data: createConnection.data } : { error: createConnection.error };
      }
    }),

    updateConnection: builder.query({
      async queryFn(arg, queryApi, extraOptions, baseQuery) {
        const { connectionPayload, workspaceId } = arg;

        const { src, dest, schedule, uiState, connectionName, connId = '' } = connectionPayload;

        const sourceRes = await baseQuery({
          url: `/workspaces/${workspaceId}/sources/create`,
          method: 'POST',
          body: src
        });

        if (sourceRes.error) return { error: sourceRes.error };

        const { id: sourceId } = sourceRes.data;

        const destRes = await baseQuery({
          url: `/workspaces/${workspaceId}/destinations/create`,
          method: 'POST',
          body: dest
        });

        if (destRes.error) return { error: destRes.error };

        const { id: destinationId } = destRes.data;

        const connPayload = {
          id: connId,
          name: connectionName,
          source_id: sourceId,
          destination_id: destinationId,
          ui_state: uiState,
          schedule,
          mode: 'etl'
        };

        const result = await baseQuery({
          url: `/workspaces/${workspaceId}/syncs/update`,
          method: 'POST',
          body: connPayload
        });
        return result.data ? { data: result.data } : { error: result.error };
      }
    })
  }),
  //@ts-ignore
  overrideExisting: module.hot?.status() === 'apply'
});

export const {
  useLazyCreateDefaultWarehouseConnectionQuery,
  useLazyCreateConnectionQuery,
  useLazyUpdateConnectionQuery
} = connectionApiSlice;
