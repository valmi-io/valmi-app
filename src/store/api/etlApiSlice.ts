import { apiSlice } from '@/store/api/apiSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';

const promptsAdapter: any = createEntityAdapter();
const initialPromptsState = promptsAdapter.getInitialState();

const previewAdapter: any = createEntityAdapter({
  selectId: (e: any) => e._airbyte_ab_id
});

const initialPreviewState = previewAdapter.getInitialState();

const exploresAdapter: any = createEntityAdapter();
const initialExploresState = exploresAdapter.getInitialState();

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

    getPromptById: builder.query({
      query: ({ promptId }) => `/prompts/${promptId}`,
      transformResponse: (responseData) => {
        return promptsAdapter.setOne(initialPromptsState, responseData);
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
    }),

    getExplores: builder.query({
      query: ({ workspaceId }) => `/explores/workspaces/${workspaceId}`,

      transformResponse: (responseData) => {
        return exploresAdapter.setAll(initialExploresState, responseData);
      },
      providesTags: (result, error, workspaceId) => {
        const tags = result?.ids
          ? [...result.ids.map((id: any) => ({ type: 'Explore' as const, id })), { type: 'Explore' as const }]
          : [{ type: 'Explore' as const }];

        return tags;
      }
    }),

    createExplore: builder.mutation({
      query: ({ workspaceId, explore }) => ({
        url: `/explores/workspaces/${workspaceId}/create`,
        method: 'POST',
        body: explore
      }),
      invalidatesTags: ['Explore']
    })
  }),
  //@ts-ignore
  overrideExisting: module.hot?.status() === 'apply'
});

export const {
  useGetPromptsQuery,
  useGetPreviewDataQuery,
  useLazyGetPreviewDataQuery,
  useGetPromptByIdQuery,
  useGetExploresQuery,
  useCreateExploreMutation
} = etlApiSlice;
