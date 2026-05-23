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
    materialName: string
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
    }),
})

export const {
    useGetRequestMaterialsQuery,
    useCreateRequestMaterialMutation,
} = requestMaterialsApi
