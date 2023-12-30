import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'

const streamsAdapter: any = createEntityAdapter()
const initialState = streamsAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getStreams: builder.query({
      query: workspaceId => `/streams/workspaces/${workspaceId}/config/stream`,
      transformResponse: responseData => {
        return streamsAdapter.setAll(initialState, (responseData as { objects: any[] })?.objects??[])
      },
      providesTags: (result, error, workspaceId) =>{
        //console.log(result);
        const tags =  result?.ids
        ? [
            ...result.ids.map(( id : any) => ({ type: 'Stream' as const, id })),
            { type: 'Stream' as const},
          ]
        : [{ type: 'Stream' as const}];
        //console.log(tags);
        return tags;
   }}),

    createStream: builder.mutation({
      query: ({ workspaceId, stream }) => ({
        url: `/streams/workspaces/${workspaceId}/config/stream`,
        method: 'POST',
        body: stream,
      }),
      invalidatesTags: ['Stream'],
    }),

    editStream: builder.mutation({
      query: ({ workspaceId, stream }) => ({
        url: `/streams/workspaces/${workspaceId}/config/stream/${stream.id}`,
        method: 'PUT',
        body: stream,
      }),
      invalidatesTags: (result, error, arg) =>
      {
        const tags = [{ type: 'Stream', id: arg.stream.id }];
        //console.log(tags);
        return tags;
      }
    }),

    deleteStream: builder.mutation({
      query: ({ workspaceId, streamId }) => ({
        url: `/streams/workspaces/${workspaceId}/config/stream/${streamId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Stream', id: arg.streamId }],
    }),

    streamSchema: builder.query({
      query: workspaceId => `/streams/workspaces/${workspaceId}/api/schema/stream`,
    }),
  })
})



export const { useGetStreamsQuery, useCreateStreamMutation, useEditStreamMutation, useDeleteStreamMutation, useStreamSchemaQuery } = extendedApiSlice;







/* Getting selectors from the transformed response */
export const  getStreamSelectors = ( workspaceId: string)=> {
  const getStreamsResult = extendedApiSlice.endpoints.getStreams.select(workspaceId)

  const getStreamsData = createSelector(
    getStreamsResult,
    usersResult => usersResult.data
  )

  const { selectAll: selectAllStreams, selectById: selectStreamById } =
  streamsAdapter.getSelectors(state => getStreamsData(state) ?? initialState);

  return {selectAllStreams, selectStreamById};
}