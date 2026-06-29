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
    vehicleId: string
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

export interface VehicleAssignedEmployee {
    id: string
    name: string
    email: string
    profile: string | null
}

export interface VehicleItem {
    id: string
    model: string
    year: number
    type: string
    purchaseDate?: string
    purchaseCost?: number
    insuranceExpires?: string
    isDeleted: boolean
    assignEmployeeId?: string | null
    categoryId?: string
    assignedEmployee?: VehicleAssignedEmployee | null
    createdAt?: string
    updatedAt?: string
}

export interface GetVehiclesParams {
    page?: number
    limit?: number
}

export interface VehicleListResponse {
    success: boolean
    statusCode?: number
    message: string
    data: VehicleItem[]
    pagination?: RequestVehiclesPagination
}

const VEHICLES_DROPDOWN_LIMIT = 150

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

        getVehicles: builder.query<VehicleListResponse, GetVehiclesParams | void>({
            query: (params) => ({
              url: '/vehicles',
              method: 'GET',
              params: {
                page: params?.page ?? 1,
                limit: params?.limit ?? VEHICLES_DROPDOWN_LIMIT,
              },
            }),
            providesTags: ['RequestVehicles'],
          }),
    }),
})

export const {
    useGetRequestVehiclesQuery,
    useCreateRequestVehicleMutation,
    useDeleteRequestVehicleMutation,
    useGetVehiclesQuery,
} = requestVehiclesApi
