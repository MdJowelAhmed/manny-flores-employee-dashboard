import { baseApi } from '../baseApi'
import type { MyTask, MyTaskStatus } from '@/pages/MyTask/myTaskData'

export interface GetMyTasksParams {
    page?: number
    limit?: number
}

export interface MyTaskListMeta {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
}

export interface MyTaskListResponse {
    success: boolean
    statusCode?: number
    message: string
    data: MyTask[]
    meta?: MyTaskListMeta
}

export interface UpdateMyTaskStatusPayload {
    taskStatus: MyTaskStatus
}

export interface UpdateMyTaskStatusResponse {
    success: boolean
    statusCode?: number
    message: string
    data?: MyTask
}

const myTaskApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyTasks: builder.query<MyTaskListResponse, GetMyTasksParams | void>({
            query: (params) => ({
                url: '/tasks',
                method: 'GET',
                params: {
                    page: params?.page ?? 1,
                    limit: params?.limit ?? 10,
                },
            }),
            providesTags: ['MyTask'],
        }),

        updateMyTaskStatus: builder.mutation<
            UpdateMyTaskStatusResponse,
            { id: string } & UpdateMyTaskStatusPayload
        >({
            query: ({ id, ...body }) => ({
                url: `/tasks/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['MyTask'],
        }),
    }),
})

export const {
    useGetMyTasksQuery,
    useUpdateMyTaskStatusMutation,
} = myTaskApi
