import { apiSlice } from '@/store/api/apiSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';

const promptsAdapter: any = createEntityAdapter();
const initialPromptsState = promptsAdapter.getInitialState();

const previewAdapter: any = createEntityAdapter({
  selectId: (e: any) => e._airbyte_ab_id
});

const initialPreviewState = previewAdapter.getInitialState();

export const etlApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrompts: builder.query({
      query: (arg) => `/prompts/`,
      transformResponse: (responseData) => {
        return promptsAdapter.setAll(initialPromptsState, responseData);
      },
      providesTags: (result, error) => {
        const tags = result?.ids
          ? [...result.ids.map((id: any) => ({ type: 'Prompt' as const, id })), { type: 'Prompt' as const }]
          : [{ type: 'Prompt' as const }];

        return tags;
      }
    }),

    getPreviewData: builder.query({
      query: ({ workspaceId, promptId }) => `/explores/workspaces/${workspaceId}/prompts/${promptId}/preview`,
      transformResponse: (responseData) => {
        return previewAdapter.setAll(initialPreviewState, responseData);
      },
      providesTags: (result, error) => {
        const tags = result?.ids
          ? [
              ...result.ids.map((_airbyte_ab_id: any) => ({ type: 'Preview' as const, _airbyte_ab_id })),
              { type: 'Preview' as const }
            ]
          : [{ type: 'Preview' as const }];

        return tags;
      }
    })
  }),
  //@ts-ignore
  overrideExisting: module.hot?.status() === 'apply'
});

export const { useGetPromptsQuery, useGetPreviewDataQuery } = etlApiSlice;
