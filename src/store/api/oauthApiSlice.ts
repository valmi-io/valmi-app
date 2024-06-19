/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 23rd 2024, 1:53:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { apiSlice } from '@/store/api/apiSlice';
import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';

const oauthApiConfigAdapter: any = createEntityAdapter({
  selectId: (e: any) => e.type
});

const initialOAuthKeysState = oauthApiConfigAdapter.getInitialState();

export const oAuthApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    oAuthSchema: builder.query({
      query: ({ type }) => `/oauth/schema/${type}`
    }),

    getOAuthApiConfig: builder.query({
      query: ({ workspaceId, type }) => `/oauth/workspaces/${workspaceId}/keys/${type}`,
      transformResponse: (responseData) => {
        return oauthApiConfigAdapter.setAll(initialOAuthKeysState, responseData);
      },
      providesTags: (result, error, workspaceId) => {
        const tags = result?.ids
          ? [...result.ids.map((id: any) => ({ type: 'OAuth' as const, id })), { type: 'OAuth' as const }]
          : [{ type: 'OAuth' as const }];

        return tags;
      }
    }),

    createOAuthConfig: builder.mutation({
      query: ({ workspaceId, oauth }) => ({
        url: `/oauth/workspaces/${workspaceId}/config/create`,
        method: 'POST',
        body: oauth
      }),
      invalidatesTags: ['OAuth']
    }),

    editOAuthConfig: builder.mutation({
      query: ({ workspaceId, oauth }) => ({
        url: `/oauth/workspaces/${workspaceId}/config/update`,
        method: 'PUT',
        body: oauth
      }),
      invalidatesTags: ['OAuth']
    }),

    getConfiguredConnectors: builder.query({
      query: (workspaceId) => `${workspaceId}/connectors/configured`
    }),

    getNotConfiguredConnectors: builder.query({
      query: (workspaceId) => `${workspaceId}/connectors/not_configured`
    })
  }),
  //@ts-ignore
  overrideExisting: module.hot?.status() === 'apply'
});

export const {
  useOAuthSchemaQuery,
  useGetOAuthApiConfigQuery,
  useLazyGetOAuthApiConfigQuery,

  useCreateOAuthConfigMutation,
  useEditOAuthConfigMutation,
  useGetConfiguredConnectorsQuery,
  useGetNotConfiguredConnectorsQuery
} = oAuthApiSlice;

/* Getting selectors from the transformed response */
export const getOAuthSelectors = (workspaceId: string) => {
  const getOAuthResult = oAuthApiSlice.endpoints.getOAuthApiConfig.select(workspaceId);

  const getOAuthData = createSelector(getOAuthResult, (usersResult) => usersResult.data);

  const { selectAll: selectAllOAuthConfigs, selectById: selectOAuthConfigById } =
    // @ts-ignore
    oauthApiConfigAdapter.getSelectors((state) => getOAuthData(state) ?? initialOAuthKeysState);

  return { selectAllOAuthConfigs, selectOAuthConfigById };
};
