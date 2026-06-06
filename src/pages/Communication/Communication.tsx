import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Paperclip, Send, CheckCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

import { UserContext } from '@/provider/UserContext'
import {
  useGetAllChatListQuery,
  useGetMessageListQuery,
  useSendMessageMutation,
  type ChatConversation,
  type ChatMessage,
} from '@/redux/slices/chatApi'
import { getImageUrl } from '@/components/common/getImageUrl'
import { ChatSidebar } from './components'

function getChatTitle(conversation: ChatConversation, myId: string) {
  if (conversation.groupName?.trim()) return conversation.groupName
  const others = conversation.participants.filter((p) => p.id !== myId)
  return others.map((p) => p.name).join(', ') || 'Chat'
}

function getChatAvatarParticipant(conversation: ChatConversation, myId: string) {
  return conversation.participants.find((p) => p.id !== myId) ?? conversation.participants[0]
}

export default function Communication() {
  const { socket, user } = useContext(UserContext) as {
    socket: { on: (event: string, handler: (data: ChatMessage) => void) => void; off: (event: string, handler: (data: ChatMessage) => void) => void } | null
    user: { _id?: string; id?: string; name?: string; profile?: string | null } | null
  }
  const myId = user?._id ?? user?.id ?? ''

  const [messageInput, setMessageInput] = useState('')
  const [messageList, setMessageList] = useState<ChatMessage[]>([])
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { data: chatListData, isLoading: isChatListLoading } = useGetAllChatListQuery()
  const conversations = chatListData?.data ?? []

  useEffect(() => {
    if (selectedChatId) return
    if (conversations.length > 0) {
      setSelectedChatId(conversations[0].id)
    }
  }, [conversations, selectedChatId])

  const conversation = useMemo(
    () => conversations.find((item) => item.id === selectedChatId) ?? null,
    [conversations, selectedChatId]
  )

  const { data: messageData, isFetching: isMessagesLoading } = useGetMessageListQuery(
    selectedChatId ?? '',
    { skip: !selectedChatId }
  )

  const [sendMessage, { isLoading }] = useSendMessageMutation()

  useEffect(() => {
    setMessageInput('')
    setSelectedImage(null)
    setMessageList([])
  }, [selectedChatId])

  useEffect(() => {
    if (messageData?.data) {
      setMessageList([...messageData.data])
    }
  }, [messageData])

  useEffect(() => {
    if (!socket || !selectedChatId) return
    const event = `getMessage::${selectedChatId}`
    const handleNewMessage = (data: ChatMessage) => {
      setMessageList((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev
        return [...prev, data]
      })
    }
    socket.on(event, handleNewMessage)
    return () => {
      socket.off(event, handleNewMessage)
    }
  }, [socket, selectedChatId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messageList])

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !selectedImage) || !conversation) return

    const formData = new FormData()
    formData.append('chatId', conversation.id)
    if (selectedImage) {
      formData.append('image', selectedImage)
      formData.append('type', 'image')
    } else {
      formData.append('type', 'text')
    }
    formData.append('text', messageInput)

    const res = await sendMessage(formData)
    if ((res as { data?: { success?: boolean } })?.data?.success) {
      setMessageInput('')
      setSelectedImage(null)
    }
  }

  const headerParticipant = conversation
    ? getChatAvatarParticipant(conversation, myId)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[calc(100vh-9rem)] flex bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
    >
      <ChatSidebar
        conversations={conversations}
        selectedId={selectedChatId}
        onSelect={setSelectedChatId}
        myId={myId}
        isLoading={isChatListLoading}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {conversation ? (
          <>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white shrink-0">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage
                  src={
                    headerParticipant?.profile
                      ? getImageUrl(headerParticipant.profile)
                      : undefined
                  }
                  alt={headerParticipant?.name}
                />
                <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                  {getChatTitle(conversation, myId).charAt(0) ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-accent truncate">
                  {getChatTitle(conversation, myId)}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {conversation.participants.length} participants
                </p>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto scrollbar-thin px-6 py-4 space-y-4 bg-[#F7F7F7]"
            >
              {isMessagesLoading && messageList.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Loading messages...</p>
              ) : messageList.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
              ) : (
                messageList.map((msg) => {
                  const isMine = myId === msg.senderId
                  return (
                    <div
                      key={msg.id}
                      className={cn('flex gap-3', isMine ? 'flex-row-reverse' : 'flex-row')}
                    >
                      {!isMine && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage
                            src={
                              msg.sender?.profile
                                ? getImageUrl(msg.sender.profile)
                                : undefined
                            }
                          />
                          <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                            {msg.sender?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'flex flex-col max-w-[70%]',
                          isMine ? 'items-end' : 'items-start'
                        )}
                      >
                        {!isMine && (
                          <p className="text-xs font-medium text-muted-foreground mb-0.5">
                            {msg.sender?.name}
                          </p>
                        )}
                        <div
                          className={cn(
                            'px-4 py-3',
                            isMine
                              ? 'bg-primary text-white rounded-t-lg rounded-bl-lg'
                              : 'bg-white text-gray-700 rounded-b-lg rounded-tr-lg'
                          )}
                        >
                          {msg.type === 'image' && msg.resourceUrl && (
                            <img
                              src={getImageUrl(msg.resourceUrl)}
                              className="w-full h-[180px] object-cover rounded-lg mb-2"
                              alt="Shared attachment"
                            />
                          )}
                          {msg.text && <p className="text-sm">{msg.text}</p>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground">
                          <span className="text-xs">
                            {format(new Date(msg.createdAt), 'hh:mm a')}
                          </span>
                          {isMine && <CheckCheck className="h-3.5 w-3.5" strokeWidth={2.5} />}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="shrink-0 border-t border-gray-100 px-6 py-4 bg-white">
              {selectedImage && (
                <div className="mb-3">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    className="h-16 w-16 object-cover rounded"
                    alt="Selected attachment preview"
                  />
                </div>
              )}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-accent shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Type message..."
                  className="flex-1 rounded-full border-gray-200 h-11"
                />
                <Button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0 rounded-full"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground bg-[#F7F7F7]">
            <p className="text-sm">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
