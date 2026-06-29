import { baseApi } from '../baseApi'
import type {
    RequestMaterial,
    RequestMaterialStatus,
    UrgencyLevel,
} from '@/pages/ManageMaterials/materialsData'

export interface GetRequestMaterialsParams {
    page?: number
    limit?: number
}

export interface RequestMaterialsMeta {
    total?: number
    page?: number
    limit?: number
    totalPage?: number
    totalPages?: number
}

export interface RequestMaterialsListResponse {
    success: boolean
    statusCode?: number
    message: string
    data: RequestMaterial[]
    meta?: RequestMaterialsMeta
    pagination?: RequestMaterialsMeta
}

export interface CreateRequestMaterialPayload {
    materialId: string
    quantityNeeded: number
    urgencyLevel: UrgencyLevel
    reason: string
}

export interface CreateRequestMaterialResponse {
    success: boolean
    statusCode?: number
    message: string
    data?: RequestMaterial
}

export interface UpdateRequestMaterialStatusPayload {
    status: RequestMaterialStatus
}

export interface UpdateRequestMaterialStatusResponse {
    success: boolean
    statusCode?: number
    message: string
    data?: RequestMaterial
}

export interface DeleteRequestMaterialResponse {
    success: boolean
    statusCode?: number
    message: string
}

export interface MaterialCategory {
    id: string
    name: string
}

export interface MaterialItem {
    id: string
    name: string
    unitPrice: number
    quantity: number
    stock: number
    categoryId: string
    isDeleted: boolean
    category?: MaterialCategory
    createdAt?: string
    updatedAt?: string
}

export interface GetMaterialsParams {
    page?: number
    limit?: number
}

export interface MaterialsListResponse {
    success: boolean
    statusCode?: number
    message: string
    data: MaterialItem[]
    pagination?: RequestMaterialsMeta
}

const MATERIALS_DROPDOWN_LIMIT = 150

const requestMaterialsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRequestMaterials: builder.query<
            RequestMaterialsListResponse,
            GetRequestMaterialsParams | void
        >({
            query: (params) => ({
                url: '/request-material/employee',
                method: 'GET',
                params: {
                    page: params?.page ?? 1,
                    limit: params?.limit ?? 10,
                },
            }),
            providesTags: ['RequestMaterials'],
        }),

        createRequestMaterial: builder.mutation<
            CreateRequestMaterialResponse,
            CreateRequestMaterialPayload
        >({
            query: (body) => ({
                url: '/request-material',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['RequestMaterials'],
        }),

        deleteRequestMaterial: builder.mutation<
            DeleteRequestMaterialResponse,
            string
        >({
            query: (id) => ({
                url: `/request-material/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['RequestMaterials'],
        }),

        getMaterials: builder.query<MaterialsListResponse, GetMaterialsParams | void>({
            query: (params) => ({
                url: '/materials',
                method: 'GET',
                params: {
                    page: params?.page ?? 1,
                    limit: params?.limit ?? MATERIALS_DROPDOWN_LIMIT,
                },
            }),
            providesTags: ['RequestMaterials'],
        }),
    }),
})

export const {
    useGetRequestMaterialsQuery,
    useCreateRequestMaterialMutation,
    useDeleteRequestMaterialMutation,
    useGetMaterialsQuery,
} = requestMaterialsApi
