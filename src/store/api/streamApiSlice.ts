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
      }
    }),

    streamSchema: builder.query({
      query: workspaceId => `/streams/workspaces/${workspaceId}/api/schema/stream`,
    }),
  })
})



export const { useGetStreamsQuery, useStreamSchemaQuery } = extendedApiSlice ;







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