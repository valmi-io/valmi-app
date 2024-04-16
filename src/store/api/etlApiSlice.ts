import { apiSlice } from '@/store/api/apiSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';

const promptsAdapter: any = createEntityAdapter();
const initialPromptsState = promptsAdapter.getInitialState();

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
    })
  }),
  //@ts-ignore
  overrideExisting: module.hot?.status() === 'apply'
});

export const { useGetPromptsQuery } = etlApiSlice;
