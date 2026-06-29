import { baseApi } from '../baseApi'
import type {
    EquipmentUrgencyLevel,
    RequestEquipment,
} from '@/pages/Equipment/equipmentData'

export interface GetRequestEquipmentParams {
    page?: number
    limit?: number
}

export interface RequestEquipmentPagination {
    total?: number
    page?: number
    limit?: number
    totalPage?: number
    totalPages?: number
}

export interface RequestEquipmentListResponse {
    success: boolean
    statusCode?: number
    message: string
    data: RequestEquipment[]
    pagination?: RequestEquipmentPagination
    meta?: RequestEquipmentPagination
}

export interface CreateRequestEquipmentPayload {
    equipmentId: string
    urgencyLevel: EquipmentUrgencyLevel
    reason: string
}

export interface CreateRequestEquipmentResponse {
    success: boolean
    statusCode?: number
    message: string
    data?: RequestEquipment
}

export interface DeleteRequestEquipmentResponse {
    success: boolean
    statusCode?: number
    message: string
}

export interface EquipmentItem {
    id: string
    equipmentName: string
    purchaseDate?: string
    purchaseCost?: number
    warrantyExpiryDate?: string
    isDeleted: boolean
    userId?: string
    categoryId?: string
    createdAt?: string
    updatedAt?: string
}

export interface GetEquipmentParams {
    page?: number
    limit?: number
}

export interface EquipmentListResponse {
    success: boolean
    statusCode?: number
    message: string
    data: EquipmentItem[]
    pagination?: RequestEquipmentPagination
}

const EQUIPMENT_DROPDOWN_LIMIT = 150

const requestEquipmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRequestEquipment: builder.query<
            RequestEquipmentListResponse,
            GetRequestEquipmentParams | void
        >({
            query: (params) => ({
                url: '/equipment-request',
                method: 'GET',
                params: {
                    page: params?.page ?? 1,
                    limit: params?.limit ?? 10,
                },
            }),
            providesTags: ['RequestEquipment'],
        }),

        createRequestEquipment: builder.mutation<
            CreateRequestEquipmentResponse,
            CreateRequestEquipmentPayload
        >({
            query: (body) => ({
                url: '/equipment-request',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['RequestEquipment'],
        }),

        deleteRequestEquipment: builder.mutation<
            DeleteRequestEquipmentResponse,
            string
        >({
            query: (id) => ({
                url: `/equipment-request/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['RequestEquipment'],
        }),

        getEquipment: builder.query<EquipmentListResponse, GetEquipmentParams | void>({
            query: (params) => ({
                url: '/equipment',
                method: 'GET',
                params: {
                    page: params?.page ?? 1,
                    limit: params?.limit ?? EQUIPMENT_DROPDOWN_LIMIT,
                },
            }),
            providesTags: ['RequestEquipment'],
        }),
    }),
})

export const {
    useGetRequestEquipmentQuery,
    useCreateRequestEquipmentMutation,
    useDeleteRequestEquipmentMutation,
    useGetEquipmentQuery,
} = requestEquipmentApi
