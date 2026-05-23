import { baseApi } from '../baseApi'
import type {
    RequestVehicle,
    VehicleUrgencyLevel,
} from '@/pages/Vehicles/vehiclesData'

export interface GetRequestVehiclesParams {
    page?: number
    limit?: number
}

export interface RequestVehiclesPagination {
    total?: number
    page?: number
    limit?: number
    totalPage?: number
    totalPages?: number
}

export interface RequestVehiclesListResponse {
    success: boolean
    statusCode?: number
    message: string
    data: RequestVehicle[]
    pagination?: RequestVehiclesPagination
    meta?: RequestVehiclesPagination
}

export interface CreateRequestVehiclePayload {
    vehicleType: string
    projectName: string
    urgencyLevel: VehicleUrgencyLevel
    reason: string
}

export interface CreateRequestVehicleResponse {
    success: boolean
    statusCode?: number
    message: string
    data?: RequestVehicle
}

export interface DeleteRequestVehicleResponse {
    success: boolean
    statusCode?: number
    message: string
}

const requestVehiclesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRequestVehicles: builder.query<
            RequestVehiclesListResponse,
            GetRequestVehiclesParams | void
        >({
            query: (params) => ({
                url: '/request-vehicle',
                method: 'GET',
                params: {
                    page: params?.page ?? 1,
                    limit: params?.limit ?? 10,
                },
            }),
            providesTags: ['RequestVehicles'],
        }),

        createRequestVehicle: builder.mutation<
            CreateRequestVehicleResponse,
            CreateRequestVehiclePayload
        >({
            query: (body) => ({
                url: '/request-vehicle',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['RequestVehicles'],
        }),

        deleteRequestVehicle: builder.mutation<
            DeleteRequestVehicleResponse,
            string
        >({
            query: (id) => ({
                url: `/request-vehicle/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['RequestVehicles'],
        }),
    }),
})

export const {
    useGetRequestVehiclesQuery,
    useCreateRequestVehicleMutation,
    useDeleteRequestVehicleMutation,
} = requestVehiclesApi
