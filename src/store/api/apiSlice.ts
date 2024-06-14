// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 5:40:42 pm
 * Author: Nagendra S @ valmi.io
 */

import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';

import constants from '@constants/index';
import { getAuthTokenCookie, getCookie, setCookie } from '@/lib/cookies';
import { signOutUser } from '@/utils/lib';

const credentialsAdapter: any = createEntityAdapter();
const initialCredentialsState = credentialsAdapter.getInitialState();

const connectionsAdapter: any = createEntityAdapter();
const initialConnectionsState = connectionsAdapter.getInitialState();

const staggeredBaseQueryWithBailOut = retry(
  async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: constants.urls.API_URL,
      timeout: 60000, // 60 seconds,
      prepareHeaders: async (headers, { getState }) => {
        const { accessToken = '' } = (await getCookie(getAuthTokenCookie())) ?? '';

        if (accessToken) {
          headers.set('authorization', `Bearer ${accessToken}`);
        }

        return headers;
      }
    })(args, api, extraOptions);

    // bail out of re-tries immediately if unauthorized or if errors are from client side,
    // because we know successive re-retries would be redundant
    if (result.error?.status < 500) {
      retry.fail(result.error);
    }

    return result;
  },
  {
    maxRetries: 3
  }
);

// Define our single API slice object
export const apiSlice = createApi({
  tagTypes: [
    'Stream',
    'Destination',
    'Link',
    'Log',
    'OAuth',
    'Analytics-Destination',
    'Prompt',
    'Preview',
    'Explore',
    'Package',
    'Credential',
    'Connection'
  ],

  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/api/v1'
  baseQuery: staggeredBaseQueryWithBailOut,
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    logoutUser: builder.query({
      query: () => {
        return {
          url: '/token/logout/',
          method: 'POST'
        };
      }
    }),

    fetchIntegrationSpec: builder.query({
      query: (arg) => {
        const { type, workspaceId } = arg;
        return {
          url: `/workspaces/${workspaceId}/connectors/${type}/spec`
        };
      }
    }),

    fetchConnectors: builder.query({
      // The URL for the request is '/api/v1/connectors'
      query: ({ workspaceId }) => {
        return {
          url: `${workspaceId}/connectors`
        };
      }
    }),

    checkConnector: builder.query({
      async queryFn(arg, queryApi, extraOptions, baseQuery) {
        const { type, workspaceId, config, name } = arg;
        const result = await baseQuery({
          url: `/workspaces/${workspaceId}/connectors/${type}/check`,
          method: 'POST',
          body: config
        });
        return result.data ? { data: result.data } : { error: result.error };
      }
    }),

    discoverConnector: builder.query({
      async queryFn(arg, queryApi, extraOptions, baseQuery) {
        const { config, workspaceId, connectorType, queryId } = arg;

        const result = await baseQuery({
          url: `/workspaces/${workspaceId}/connectors/${connectorType}/discover`,
          method: 'POST',
          body: {
            config
          }
        });

        return result.data
          ? { data: { resultData: result.data, queryId: queryId } }
          : { error: { errorData: result.error, queryId: queryId } };
      }
    }),

    createConnector: builder.query({
      async queryFn(arg, queryApi, extraOptions, baseQuery) {
        const { config, workspaceId, connectorType, queryId, createdValue } = arg;
        const result = await baseQuery({
          url: `/workspaces/${workspaceId}/connectors/${connectorType}/create`,
          method: 'POST',
          body: {
            config
          }
        });
        return result.data
          ? { data: { resultData: result.data, queryId: queryId } }
          : { error: { errorData: result.error, queryId: queryId } };
      }
    }),

    // fetchCredentials: builder.query({
    //   queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
    //     const { workspaceId, queryId } = arg;

    //     const result = await baseQuery({
    //       url: `/workspaces/${workspaceId}/credentials/`
    //     });

    //     return result.data
    //       ? { data: { resultData: result.data, queryId: queryId } }
    //       : { error: { errorData: result.error, queryId: queryId } };
    //   }
    // }),
    fetchCredentials: builder.query({
      query: ({ workspaceId }) => `/workspaces/${workspaceId}/credentials/`,
      transformResponse: (responseData) => {
        return credentialsAdapter.setAll(initialCredentialsState, responseData);
      },
      providesTags: (result, error) => {
        const tags = result?.ids
          ? [...result.ids.map((id: any) => ({ type: 'Credential' as const, id })), { type: 'Credential' as const }]
          : [{ type: 'Credential' as const }];

        return tags;
      }
    }),
    addSync: builder.query({
      async queryFn(arg, queryApi, extraOptions, baseQuery) {
        const { src, dest, schedule, uiState, syncName, workspaceId } = arg;

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
        const syncPayload = {
          name: syncName,
          source_id: sourceId,
          destination_id: destinationId,
          ui_state: uiState,
          schedule
        };
        const createSync = await baseQuery({
          url: `/workspaces/${workspaceId}/syncs/create`,
          method: 'POST',
          body: syncPayload
        });
        return createSync.data ? { data: createSync.data } : { error: createSync.error };
      }
    }),

    updateSync: builder.query({
      async queryFn(arg, queryApi, extraOptions, baseQuery) {
        const { src, dest, schedule, uiState, syncName, syncId = '', workspaceId } = arg;

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
        const syncPayload = {
          id: syncId,
          name: syncName,
          source_id: sourceId,
          destination_id: destinationId,
          ui_state: uiState,
          schedule
        };
        const result = await baseQuery({
          url: `/workspaces/${workspaceId}/syncs/update`,
          method: 'POST',
          body: syncPayload
        });
        return result.data ? { data: result.data } : { error: result.error };
      }
    }),

    fetchSyncs: builder.query({
      // The URL for the request is '/api/v1/syncs'
      query: (arg) => {
        const { workspaceId } = arg;
        return {
          url: `/workspaces/${workspaceId}/syncs/`
        };
      }
    }),

    updateDataFlowStatus: builder.query({
      query: (arg) => {
        const { workspaceId, enable, config } = arg;
        let url = `/workspaces/${workspaceId}/syncs/disable`;
        if (enable) {
          url = `/workspaces/${workspaceId}/syncs/enable`;
        }

        return {
          url,
          method: 'POST',
          body: config
        };
      }
    }),

    getSyncById: builder.query({
      query: ({ workspaceId, syncId }) => `/workspaces/${workspaceId}/syncs/${syncId}`,
      transformResponse: (responseData) => {
        return connectionsAdapter.setOne(initialConnectionsState, responseData);
      },
      providesTags: (result, error) => {
        const tags = result?.ids
          ? [...result.ids.map((id: any) => ({ type: 'Connection' as const, id })), { type: 'Connection' as const }]
          : [{ type: 'Connection' as const }];

        return tags;
      }
    }),

    getSyncRunsById: builder.query({
      query: (arg) => {
        const { workspaceId, syncId, before, limit } = arg;
        const date = before.replace(/"/g, '');

        return {
          url: `/workspaces/${workspaceId}/syncs/${syncId}/runs/?before=${date}&limit=${limit}`
        };
      }
    }),

    createNewSyncRun: builder.query({
      query: (arg) => {
        const { workspaceId, syncId, config } = arg;
        const url = `/workspaces/${workspaceId}/syncs/${syncId}/runs/create`;

        return {
          url,
          method: 'POST',
          body: config
        };
      }
    }),

    abortSyncRunById: builder.query({
      query: (arg) => {
        const { workspaceId, syncId, runId } = arg;
        const url = `/workspaces/${workspaceId}/syncs/${syncId}/runs/${runId}/abort`;

        return {
          url,
          method: 'POST'
        };
      }
    }),

    getSyncRunLogsById: builder.query({
      query: (arg) => {
        const { workspaceId, syncId, runId, connector, since = null, before = null } = arg;

        let url = `workspaces/${workspaceId}/syncs/${syncId}/runs/${runId}/logs?connector=${connector}`;

        if (since) {
          url = url + `&since=${since}`;
        }
        if (before) {
          url = url + `&before=${before}`;
        }

        return {
          url: url
        };
      }
    })
  })
});

export const {
  useLazyFetchIntegrationSpecQuery,
  useFetchIntegrationSpecQuery,
  useFetchConnectorsQuery,
  useLazyCreateConnectorQuery,
  useLazyDiscoverConnectorQuery,
  useFetchCredentialsQuery,
  useLazyFetchCredentialsQuery,
  useLazyAddSyncQuery,
  useLazyUpdateSyncQuery,
  useFetchSyncsQuery,
  useLazyUpdateDataFlowStatusQuery,
  useLazyCheckConnectorQuery,
  useLazyGetSyncRunsByIdQuery,
  useLazyGetSyncByIdQuery,
  useGetSyncByIdQuery,
  useLazyCreateNewSyncRunQuery,
  useLazyAbortSyncRunByIdQuery,
  useLazyGetSyncRunLogsByIdQuery,
  useLazyLogoutUserQuery
} = apiSlice;

/* Getting selectors from the transformed response */
export const getCredentialsSelectors = (workspaceId: string) => {
  const getCredentialsResult = apiSlice.endpoints.fetchCredentials.select({ workspaceId });

  const getCredentialsData = createSelector(getCredentialsResult, (usersResult) => usersResult.data);

  const { selectAll: selectAllCredentials, selectById: selectCredentialById } =
    // @ts-ignore
    credentialsAdapter.getSelectors((state) => getCredentialsData(state) ?? initialCredentialsState);

  return { selectAllCredentials, selectCredentialById };
};

export const getSyncDetails = (workspaceId: string, syncId: string) => {
  const getSyncsResult = apiSlice.endpoints.getSyncById.select({ workspaceId, syncId });

  const getSyncsData = createSelector(getSyncsResult, (syncResult) => syncResult.data);

  const { selectById: selectSyncById } =
    // @ts-ignore
    connectionsAdapter.getSelectors((state) => getSyncsData(state) ?? initialConnectionsState);

  return { selectSyncById };
};
