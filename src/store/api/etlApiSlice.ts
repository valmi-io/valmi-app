import { apiSlice } from '@/store/api/apiSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';

const promptsAdapter: any = createEntityAdapter();
const initialPromptsState = promptsAdapter.getInitialState();

const previewAdapter: any = createEntityAdapter();

const initialPreviewState = previewAdapter.getInitialState();

const exploresAdapter: any = createEntityAdapter();
const initialExploresState = exploresAdapter.getInitialState();

const packageAdapter: any = createEntityAdapter({
  selectId: (e: any) => e.name
});
const initialpackageState = packageAdapter.getInitialState();

export const etlApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrompts: builder.query({
      query: ({ workspaceId }) => `/workspaces/${workspaceId}/prompts`,
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
      query: ({ workspaceId, promptId }) => `/workspaces/${workspaceId}/prompts/${promptId}`,
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
      query: ({ workspaceId, promptId }) => `/workspaces/${workspaceId}/prompts/${promptId}/preview`,
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

    getPromptPreview: builder.mutation({
      query: ({ workspaceId, promptId, prompt }) => ({
        url: `/workspaces/${workspaceId}/prompts/${promptId}/preview`,
        method: 'POST',
        body: prompt
      }),
      transformResponse: (responseData) => {
        return previewAdapter.setAll(initialPreviewState, responseData);
      }
    }),

    getExplores: builder.query({
      query: ({ workspaceId }) => `/workspaces/${workspaceId}/explores`,

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
        url: `/workspaces/${workspaceId}/explores/create`,
        method: 'POST',
        body: explore
      }),
      invalidatesTags: ['Explore']
    }),

    getExploreById: builder.query({
      query: ({ workspaceId, exploreId }) => `/workspaces/${workspaceId}/explores/${exploreId}`,
      transformResponse: (responseData) => {
        return exploresAdapter.setOne(initialExploresState, responseData);
      },
      providesTags: (result, error, exploreId) => {
        const tags = result?.ids
          ? [...result.ids.map((id: any) => ({ type: 'Explore' as const, id })), { type: 'Explore' as const }]
          : [{ type: 'Explore' as const }];

        return tags;
      }
    }),

    getExploreStatusById: builder.query({
      query: (arg) => {
        const { workspaceId, exploreId } = arg;
        return {
          url: `/workspaces/${workspaceId}/${exploreId}/explores/status`
        };
      }
    }),

    getPackageById: builder.query({
      query: ({ packageId }) => `/packages/${packageId}`,

      transformResponse: (responseData) => {
        return packageAdapter.setOne(initialpackageState, responseData);
      },
      providesTags: (result, error) => {
        const tags = result?.ids
          ? [...result.ids.map((id: any) => ({ type: 'Package' as const, id })), { type: 'Package' as const }]
          : [{ type: 'Package' as const }];

        return tags;
      }
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
  useCreateExploreMutation,
  useGetExploreByIdQuery,
  useGetExploreStatusByIdQuery,
  useGetPackageByIdQuery,
  useGetPromptPreviewMutation
} = etlApiSlice;
