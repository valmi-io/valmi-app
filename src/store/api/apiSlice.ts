// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 5:40:42 pm
 * Author: Nagendra S @ valmi.io
 */

import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import AuthStorage from 'src/utils/auth-storage';
import constants from '../../constants';

const staggeredBaseQueryWithBailOut = retry(
  async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: constants.urls.API_URL,
      timeout: 60000, // 60 seconds
      prepareHeaders: async (headers, { getState }) => {
        const token = (await AuthStorage.token) || '';

        // If we have a token set in state, let's assume that we should be passing it.
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
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
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/api/v1'
  baseQuery: staggeredBaseQueryWithBailOut,
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // The `getSpaces` endpoint is a "query" operation that returns data
    fetchWorkSpaces: builder.query({
      // The URL for the request is '/api/v1/spaces'
      query: () => ({
        url: '/spaces/'
      })
    }),

    signupUser: builder.query({
      // The URL for the request is '/api/v1/users/'
      query: (arg) => {
        return {
          url: '/users/',
          method: 'POST',
          body: arg
        };
      }
    }),

    activateUser: builder.query({
      // The URL for the request is '/api/v1/users/activation/'
      query: (arg) => {
        return {
          url: '/users/activation/',
          method: 'POST',
          body: arg
        };
      }
    }),

    resendActivationToken: builder.query({
      // The URL for the request is '/api/v1/users/resend_activation/'
      query: (arg) => {
        return {
          url: '/users/resend_activation/',
          method: 'POST',
          body: arg
        };
      }
    }),

    loginAndFetchWorkSpaces: builder.query({
      async queryFn(arg, queryApi, extraOptions, baseQuery) {
        const user = await baseQuery({
          url: '/token/login',
          method: 'POST',
          body: arg,
          prepareHeaders: (headers) => {
            headers.set('Content-Type', 'multipart/form-data');
            return headers;
          }
        });
        if (user.error) return { error: user.error };
        const token = user.data.auth_token;

        // storing auth token in cookie.
        AuthStorage.value = {
          token: token
        };

        const result = await baseQuery('/spaces/');

        if (result.error) {
          if (result.error?.data?.detail === 'Unauthorized') {
            // destroy auth token
            AuthStorage.destroy();
          }
          return { error: result.error };
        }
        return result.data && { data: result.data };
      }
    }),

    fetchConnectorSpec: builder.query({
      query: (arg) => {
        const { type, workspaceId } = arg;
        return {
          url: `/workspaces/${workspaceId}/connectors/${type}/spec`
        };
      }
    }),

    fetchConnectors: builder.query({
      // The URL for the request is '/api/v1/connectors'
      query: () => {
        return {
          url: `/connectors/`
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

    fetchCredentials: builder.query({
      queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
        const { workspaceId, queryId } = arg;

        const result = await baseQuery({
          url: `/workspaces/${workspaceId}/credentials/`
        });

        return result.data
          ? { data: { resultData: result.data, queryId: queryId } }
          : { error: { errorData: result.error, queryId: queryId } };
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
        return createSync.data
          ? { data: createSync.data }
          : { error: createSync.error };
      }
    }),

    updateSync: builder.query({
      async queryFn(arg, queryApi, extraOptions, baseQuery) {
        const {
          src,
          dest,
          schedule,
          uiState,
          syncName,
          syncId = '',
          workspaceId
        } = arg;

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

    toggleSync: builder.query({
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
      query: (arg) => {
        const { workspaceId, syncId } = arg;
        return {
          url: `/workspaces/${workspaceId}/syncs/${syncId}`
        };
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
        const {workspaceId, syncId, runId, collector, since=null, before=null} = arg;

        let url = `workspaces/${workspaceId}/syncs/${syncId}/runs/${runId}/logs?collector=${collector}`
         
        if(since) {
          url = url + `&since=${since}`
        }
        if(before) {
          url = url + `&before=${before}`
        }
        
        return {
          url: url
        };
      }
    })
  })
});

export const {
  useLazyFetchWorkSpacesQuery,
  useLazyLoginAndFetchWorkSpacesQuery,
  useLazyFetchConnectorSpecQuery,
  useFetchConnectorsQuery,
  useLazySignupUserQuery,
  useLazyActivateUserQuery,
  useLazyResendActivationTokenQuery,
  useLazyDiscoverConnectorQuery,
  useFetchCredentialsQuery,
  useLazyFetchCredentialsQuery,
  useLazyAddSyncQuery,
  useLazyUpdateSyncQuery,
  useFetchSyncsQuery,
  useLazyToggleSyncQuery,
  useLazyCheckConnectorQuery,
  useLazyGetSyncRunsByIdQuery,
  useLazyGetSyncByIdQuery,
  useGetSyncByIdQuery,
  useLazyCreateNewSyncRunQuery,
  useLazyAbortSyncRunByIdQuery,
  useLazyGetSyncRunLogsByIdQuery
} = apiSlice;
