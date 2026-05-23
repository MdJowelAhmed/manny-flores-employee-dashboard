import { baseApi } from "@/redux/baseApi";

const payrollApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPayrollData: builder.query({
            query: ({ page, limit }: { page: number, limit: number }) => ({
                url: '/payroll-management/employee',
                params: {
                    page,
                    limit,
                },
            }),
        }),
    }),
})
export const { useGetPayrollDataQuery } = payrollApi