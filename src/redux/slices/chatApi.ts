import { baseApi } from '@/redux/baseApi'

export interface ChatParticipant {
  id: string
  name: string
  email: string
  profile: string | null
  role: string
}

export interface ChatLastMessage {
  text: string
  createdAt: string
  senderId: string
}

export interface ChatConversation {
  id: string
  status: boolean
  groupName: string
  participants: ChatParticipant[]
  lastMessage: ChatLastMessage | null
}

export interface ChatListResponse {
  success: boolean
  statusCode?: number
  message: string
  data: ChatConversation[]
}

export interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  text: string
  createdAt: string
  updatedAt: string
  resourceUrl: string | null
  type: string
  sender: {
    id: string
    name: string
    profile: string | null
  }
}

export interface ChatMessageListResponse {
  success: boolean
  statusCode?: number
  message: string
  data: ChatMessage[]
}

const chatSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllChatList: builder.query<ChatListResponse, void>({
      query: () => ({
        url: '/chat',
      }),
      providesTags: ['chats'],
    }),

    createInitialChat: builder.mutation({
      query: (id: string) => ({
        method: 'POST',
        url: `/chat/${id}`,
      }),
      invalidatesTags: ['chats'],
    }),

    getChatList: builder.query<ChatListResponse, string | void>({
      query: (search) => {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        const query = params.toString()
        return {
          url: query ? `/chat?${query}` : '/chat',
        }
      },
      providesTags: ['chats'],
    }),

    sendMessage: builder.mutation({
      query: (data: FormData) => ({
        method: 'POST',
        url: '/message',
        body: data,
      }),
      invalidatesTags: ['chats'],
    }),

    getMessageList: builder.query<ChatMessageListResponse, string>({
      query: (id) => ({
        url: `/message/${id}`,
      }),
    }),
  }),
})

export const {
  useCreateInitialChatMutation,
  useGetChatListQuery,
  useSendMessageMutation,
  useGetMessageListQuery,
  useGetAllChatListQuery,
} = chatSlice
