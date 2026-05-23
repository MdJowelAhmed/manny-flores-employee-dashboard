import { baseApi } from "@/redux/baseApi"

const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Dashboard data   
        getQuickActions: builder.query({
            query: () => ({
                url: '/employee/quick-actions',
            }),
        }),
        getOverviewHeader: builder.query({
            query: () => ({
                url: '/employee/overview-header',
            }),
        }),
        getTasks: builder.query({
            query:()=>{
                return{
                    url:"/tasks"
                }
            }
        })

    }),
})

export const {  useGetOverviewHeaderQuery, useGetQuickActionsQuery, useGetTasksQuery } = dashboardApi