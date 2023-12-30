import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'

const streamsAdapter: any = createEntityAdapter()
const initialState = streamsAdapter.getInitialState()

const destinationsAdapter: any = createEntityAdapter()
const initialDestinationsState = destinationsAdapter.getInitialState()


const linksAdapter: any = createEntityAdapter()
const initialLinksState = linksAdapter.getInitialState()

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

    destinationSchema: builder.query({
      query: ({workspaceId, type}) => `/streams/workspaces/${workspaceId}/api/schema/destination/${type}`,
    }),

    linkSchema: builder.query({
      query: ({workspaceId, type}) => `/streams/workspaces/${workspaceId}/api/schema/link/${type}`,
    }),

    // get destinations
    getDestinations: builder.query({
      query: workspaceId => `/streams/workspaces/${workspaceId}/config/destination`,
      transformResponse: responseData => {
        return destinationsAdapter.setAll(initialDestinationsState, (responseData as { objects: any[] })?.objects??[])
      },
      providesTags: (result, error, workspaceId) =>{
        //console.log(result);
        const tags =  result?.ids
        ? [
            ...result.ids.map(( id : any) => ({ type: 'Destination' as const, id })),
            { type: 'Destination' as const},
          ]
        : [{ type: 'Destination' as const}];
        //console.log(tags);
        return tags;
      }
    }),

    // create destination
    createDestination: builder.mutation({
      query: ({ workspaceId, destination }) => ({
        url: `/streams/workspaces/${workspaceId}/config/destination`,
        method: 'POST',
        body: destination,
      }),
      invalidatesTags: ['Destination'],
    }),

    // edit destination
    editDestination: builder.mutation({
      query: ({ workspaceId, destination }) => ({
        url: `/streams/workspaces/${workspaceId}/config/destination/${destination.id}`,
        method: 'PUT',
        body: destination,
      }),
      invalidatesTags: (result, error, arg) =>
      {
        const tags = [{ type: 'Destination', id: arg.destination.id }];
        return tags;
      }
    }),

    // delete destination
    deleteDestination: builder.mutation({
      query: ({ workspaceId, destinationId }) => ({
        url: `/streams/workspaces/${workspaceId}/config/destination/${destinationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Destination', id: arg.destinationId }],
    }),


    // get links
    getLinks: builder.query({
      query: workspaceId => `/streams/workspaces/${workspaceId}/config/link`,
      transformResponse: responseData => {
        return linksAdapter.setAll(initialLinksState, (responseData as { links: any[] })?.links??[])
      },
      providesTags: (result, error, workspaceId) =>{
        //console.log(result);
        const tags =  result?.ids
        ? [
            ...result.ids.map(( id : any) => ({ type: 'Link' as const, id })),
            { type: 'Link' as const},
          ]
        : [{ type: 'Link' as const}];
        //console.log(tags);
        return tags;
      }
    }),

    //create link
    createLink: builder.mutation({
      query: ({ workspaceId, link }) => ({
        url: `/streams/workspaces/${workspaceId}/config/link`,
        method: 'POST',
        body: link,
      }),
      invalidatesTags: ['Link'],
    }),

    // delete link
    deleteLink: builder.mutation({
      query: ({ workspaceId, linkId }) => ({
        url: `/streams/workspaces/${workspaceId}/config/link/${linkId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Link', id: arg.linkId }],
    }),

  })
})



export const {
  useGetStreamsQuery,
  useCreateStreamMutation,
  useEditStreamMutation,
  useDeleteStreamMutation,
  useStreamSchemaQuery,
  useDestinationSchemaQuery,
  useGetDestinationsQuery,
  useCreateDestinationMutation,
  useEditDestinationMutation,
  useDeleteDestinationMutation,

  useGetLinksQuery,
  useLinkSchemaQuery,
  useCreateLinkMutation,
  useDeleteLinkMutation,
} = extendedApiSlice;



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

export const  getDestinationSelectors = ( workspaceId: string)=> {
  const getDestinationsResult = extendedApiSlice.endpoints.getDestinations.select(workspaceId)

  const getDestinationsData = createSelector(
    getDestinationsResult,
    usersResult => usersResult.data
  )

  const { selectAll: selectAllDestinations, selectById: selectDestinationById } =
  destinationsAdapter.getSelectors(state => getDestinationsData(state) ?? initialDestinationsState);

  return {selectAllDestinations, selectDestinationById};
}

export const  getLinkSelectors = ( workspaceId: string)=> {
  const getLinksResult = extendedApiSlice.endpoints.getLinks.select(workspaceId)

  const getLinksData = createSelector(
    getLinksResult,
    usersResult => usersResult.data
  )

  const { selectAll: selectAllLinks, selectById: selectLinkById } =
  linksAdapter.getSelectors(state => getLinksData(state) ?? initialLinksState);

  return {selectAllLinks, selectLinkById};
}