import { baseApi } from "@/redux/baseApi"

const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardData: builder.query({
            query: () => ({
                url: '/dashboard',
            }),
        }),
    }),
})

export const { useGetDashboardDataQuery } = dashboardApi