import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { Search, Send, Paperclip, ArrowLeft, FileText, X, Users } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

import {
  useGetChatListQuery,
  useGetMessageListQuery,
  useSendMessageMutation,
  type ChatConversation,
  type ChatMessage,
} from '@/redux/slices/chatApi'
import { UserContext } from '@/provider/UserContext'
import { getImageUrl } from '@/components/common/getImageUrl'
import { GroupMembersModal } from './components'
import {
  getConversationAvatar,
  getConversationTitle,
  getLastMessagePreview,
  getMemberCount,
  isGroupChat,
} from './communicationUtils'

type TUserContext = {
  socket: {
    on: (event: string, handler: (data: ChatMessage) => void) => void
    off: (event: string, handler: (data: ChatMessage) => void) => void
  } | null
  user: {
    id?: string
    _id?: string
    name?: string
    profile?: string | null
  } | null
}

type AttachmentKind = 'image' | 'pdf'

const ACCEPTED_FILE_TYPES = 'image/*,application/pdf,.pdf'
const SCROLL_NEAR_BOTTOM_THRESHOLD = 100

function getCurrentUserId(user: TUserContext['user']) {
  return user?.id ?? user?._id ?? ''
}

function getFileKind(file: File): AttachmentKind | null {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return 'pdf'
  }
  return null
}

function getAttachmentFileName(url: string) {
  const name = url.split('/').pop() || 'attachment'
  return decodeURIComponent(name)
}

function isDocMessage(message: ChatMessage) {
  if (!message.resourceUrl) return false
  const type = message.type?.toLowerCase()
  return type === 'doc' || message.resourceUrl.toLowerCase().endsWith('.pdf')
}

function isImageMessage(message: ChatMessage) {
  if (!message.resourceUrl || isDocMessage(message)) return false
  const type = message.type?.toLowerCase()
  return (
    type === 'image' ||
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(message.resourceUrl)
  )
}

function sortMessagesAsc(messages: ChatMessage[]) {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
}

function ConversationAvatar({
  conversation,
  currentUserId,
  className,
  iconClassName,
}: {
  conversation: ChatConversation
  currentUserId: string
  className?: string
  iconClassName?: string
}) {
  const isGroup = isGroupChat(conversation)
  const avatar = getConversationAvatar(conversation, currentUserId)
  const title = getConversationTitle(conversation, currentUserId)

  if (isGroup) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-primary/15 shrink-0',
          className
        )}
      >
        <Users className={cn('text-primary', iconClassName ?? 'h-6 w-6')} />
      </div>
    )
  }

  return (
    <div className={cn('rounded-full overflow-hidden bg-gray-200 shrink-0', className)}>
      <img
        src={avatar ? getImageUrl(avatar) : '/default-image.png'}
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

export default function Communication() {
  const { socket, user } = useContext(UserContext) as TUserContext
  const currentUserId = getCurrentUserId(user)
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const chatIdFromUrl = searchParams.get('chatId')

  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [keyword, setKeyword] = useState('')
  const [messageList, setMessageList] = useState<ChatMessage[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showChatPanel, setShowChatPanel] = useState(false)
  const [membersModalOpen, setMembersModalOpen] = useState(false)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const messageInputRef = useRef<HTMLInputElement | null>(null)
  const isNearBottomRef = useRef(true)
  const prevChatIdRef = useRef<string | null>(null)
  const pendingChatHandledRef = useRef(false)

  const { data: chatList, isLoading: isChatListLoading } = useGetChatListQuery(keyword)

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
  }

  const updateNearBottom = () => {
    const el = scrollRef.current
    if (!el) return
    isNearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_NEAR_BOTTOM_THRESHOLD
  }

  const focusMessageInput = () => {
    requestAnimationFrame(() => messageInputRef.current?.focus())
  }

  useEffect(() => {
    const pendingChat = (location.state as { pendingChat?: ChatConversation } | null)?.pendingChat
    if (!pendingChat?.id || pendingChatHandledRef.current) return

    pendingChatHandledRef.current = true
    setSelectedConversation({
      id: pendingChat.id,
      status: pendingChat.status ?? true,
      groupName: pendingChat.groupName ?? null,
      participants: pendingChat.participants ?? [],
      lastMessage: pendingChat.lastMessage ?? null,
    })
    setShowChatPanel(true)
    setSearchParams({ chatId: pendingChat.id }, { replace: true })
  }, [location.state, setSearchParams])

  useEffect(() => {
    if (!chatList?.data?.length) return

    if (chatIdFromUrl) {
      const fromList = chatList.data.find((conversation) => conversation.id === chatIdFromUrl)
      if (fromList) {
        setSelectedConversation(fromList)
        setShowChatPanel(true)
        return
      }
    }

    if (!chatIdFromUrl && !selectedConversation) {
      const first = chatList.data[0]
      setSelectedConversation(first)
      setSearchParams({ chatId: first.id }, { replace: true })
    }
  }, [chatList?.data, chatIdFromUrl, selectedConversation, setSearchParams])

  const { data: messageData, refetch: refetchMessages } = useGetMessageListQuery(
    selectedConversation?.id ?? '',
    { skip: !selectedConversation?.id }
  )

  const [sendMessage, { isLoading }] = useSendMessageMutation()

  useEffect(() => {
    if (!selectedConversation?.id) {
      setMessageList([])
      return
    }
    setMessageList(sortMessagesAsc(messageData?.data ?? []))
  }, [messageData, selectedConversation?.id])

  const sortedMessages = useMemo(() => sortMessagesAsc(messageList), [messageList])

  const selectedIsGroup = selectedConversation ? isGroupChat(selectedConversation) : false

  useEffect(() => {
    setMessageInput('')
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    isNearBottomRef.current = true
    focusMessageInput()
  }, [selectedConversation?.id])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => updateNearBottom()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [selectedConversation?.id])

  useEffect(() => {
    const chatChanged = prevChatIdRef.current !== selectedConversation?.id
    prevChatIdRef.current = selectedConversation?.id ?? null

    if (!sortedMessages.length) return

    if (chatChanged) {
      requestAnimationFrame(() => scrollToBottom('auto'))
      isNearBottomRef.current = true
      return
    }

    if (isNearBottomRef.current) {
      requestAnimationFrame(() => scrollToBottom('smooth'))
    }
  }, [sortedMessages, selectedConversation?.id])

  useEffect(() => {
    if (!socket || !selectedConversation?.id) return

    const event = `getMessage::${selectedConversation.id}`
    const handleNewMessage = (data: ChatMessage) => {
      const isMine =
        currentUserId === data.senderId ||
        user?.id === data.senderId ||
        user?._id === data.senderId

      setMessageList((prev) => {
        if (prev.some((message) => message.id === data.id)) return prev
        return sortMessagesAsc([...prev, data])
      })

      if (isNearBottomRef.current || isMine) {
        requestAnimationFrame(() => scrollToBottom('smooth'))
      }
    }

    socket.on(event, handleNewMessage)
    return () => {
      socket.off(event, handleNewMessage)
    }
  }, [socket, selectedConversation?.id, currentUserId, user?.id, user?._id])

  const clearSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    focusMessageInput()
  }

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return
    const kind = getFileKind(file)
    if (!kind) return
    setSelectedFile(file)
    focusMessageInput()
  }

  const handleSelectConversation = (conversation: ChatConversation) => {
    setSelectedConversation(conversation)
    setShowChatPanel(true)
    setSearchParams({ chatId: conversation.id }, { replace: true })
    isNearBottomRef.current = true
  }

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !selectedFile) || !selectedConversation) return

    const formData = new FormData()
    formData.append('chatId', selectedConversation.id)
    formData.append('text', messageInput)

    if (selectedFile) {
      const kind = getFileKind(selectedFile)
      formData.append('resourceUrl', selectedFile)
      formData.append('type', kind === 'pdf' ? 'doc' : 'image')
    } else {
      formData.append('type', 'text')
    }

    const res = await sendMessage(formData)
    if ((res as { data?: { success?: boolean } })?.data?.success) {
      setMessageInput('')
      clearSelectedFile()
      isNearBottomRef.current = true
      await refetchMessages()
      requestAnimationFrame(() => scrollToBottom('smooth'))
      focusMessageInput()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[calc(100vh-90px)] min-h-0 overflow-hidden rounded-2xl border bg-white"
    >
      <div className="grid grid-cols-12 h-full min-h-0">
        <div
          className={cn(
            'lg:col-span-4 col-span-12 border-r bg-[#F7F7F7] flex flex-col min-h-0 overflow-hidden',
            showChatPanel ? 'hidden lg:flex' : 'flex'
          )}
        >
          <div className="h-[66px] bg-primary shrink-0" />

          <div className="p-3 border-b bg-white shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversation"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin">
            {isChatListLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="w-full p-3 rounded-xl bg-white animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 rounded bg-gray-200" />
                      <div className="h-3 w-full rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))
            ) : chatList?.data?.length ? (
              chatList.data.map((conversation) => {
                const active = selectedConversation?.id === conversation.id
                const title = getConversationTitle(conversation, currentUserId)
                const group = isGroupChat(conversation)
                const memberCount = getMemberCount(conversation)

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => handleSelectConversation(conversation)}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left',
                      active
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-white hover:bg-gray-100'
                    )}
                  >
                    <ConversationAvatar
                      conversation={conversation}
                      currentUserId={currentUserId}
                      className="h-12 w-12"
                      iconClassName="h-6 w-6"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold truncate text-black">{title}</p>
                        <span className="text-xs text-black shrink-0">
                          {conversation.lastMessage?.createdAt
                            ? format(parseISO(conversation.lastMessage.createdAt), 'hh:mm a')
                            : ''}
                        </span>
                      </div>
                      {group && (
                        <p className="text-[11px] text-primary font-medium mt-0.5">
                          {memberCount} members
                        </p>
                      )}
                      <p className="text-sm text-black truncate mt-1">
                        {getLastMessagePreview(conversation.lastMessage)}
                      </p>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="flex items-center justify-center py-16 text-sm text-black">
                No conversations found
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            'lg:col-span-8 col-span-12 flex flex-col bg-white h-full min-h-0 overflow-hidden',
            showChatPanel ? 'flex' : 'hidden lg:flex'
          )}
        >
          {selectedConversation ? (
            <>
              <div className="h-[66px] shrink-0 bg-primary px-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-white hover:bg-white/10 shrink-0"
                    onClick={() => setShowChatPanel(false)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  <ConversationAvatar
                    conversation={selectedConversation}
                    currentUserId={currentUserId}
                    className="h-11 w-11"
                    iconClassName="h-5 w-5"
                  />

                  <div className="min-w-0">
                    <p className="text-white font-semibold text-base truncate">
                      {getConversationTitle(selectedConversation, currentUserId)}
                    </p>
                    {selectedIsGroup && (
                      <p className="text-xs text-white/80">
                        {getMemberCount(selectedConversation)} members
                      </p>
                    )}
                  </div>
                </div>

                {/* {selectedIsGroup && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    onClick={() => setMembersModalOpen(true)}
                  >
                    <Users className="h-4 w-4 mr-1.5" />
                    View Members
                  </Button>
                )} */}
              </div>

              <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto px-5 py-6 bg-[#F7F7F7] space-y-4 scrollbar-thin"
              >
                {sortedMessages.length === 0 ? (
                  <p className="text-sm text-black text-center py-8">No messages yet</p>
                ) : (
                  sortedMessages.map((message) => {
                    const isMine =
                      currentUserId === message.senderId ||
                      user?.id === message.senderId ||
                      user?._id === message.senderId

                    return (
                      <div
                        key={message.id}
                        className={cn('flex w-full', isMine ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[70%] px-4 py-3 shadow-sm',
                            isMine
                              ? 'bg-primary text-white rounded-t-2xl rounded-bl-2xl'
                              : 'bg-white rounded-t-2xl rounded-br-2xl'
                          )}
                        >
                          {isImageMessage(message) && (
                            <img
                              src={getImageUrl(message.resourceUrl!)}
                              alt="chat attachment"
                              className="max-w-full w-full max-h-[320px] min-h-[120px] object-contain rounded-xl bg-black/5 mb-2"
                              loading="lazy"
                            />
                          )}

                          {isDocMessage(message) && (
                            <button
                              type="button"
                              onClick={() =>
                                window.open(
                                  getImageUrl(message.resourceUrl!),
                                  '_blank',
                                  'noopener,noreferrer'
                                )
                              }
                              className={cn(
                                'flex w-full items-center gap-3 rounded-xl border px-4 py-3 mb-2 text-left transition-opacity hover:opacity-90',
                                isMine
                                  ? 'border-white/30 bg-white/10'
                                  : 'border-gray-200 bg-gray-50'
                              )}
                            >
                              <FileText
                                className={cn(
                                  'h-8 w-8 shrink-0',
                                  isMine ? 'text-white' : 'text-primary'
                                )}
                              />
                              <div className="min-w-0 flex-1">
                                <p
                                  className={cn(
                                    'text-sm font-medium truncate',
                                    isMine ? 'text-white' : 'text-gray-900'
                                  )}
                                >
                                  {getAttachmentFileName(message.resourceUrl!)}
                                </p>
                                <p
                                  className={cn(
                                    'text-xs',
                                    isMine ? 'text-white/80' : 'text-black'
                                  )}
                                >
                                  PDF document
                                </p>
                              </div>
                            </button>
                          )}

                          {message.text && (
                            <p
                              className={cn(
                                'text-sm leading-relaxed',
                                isMine ? 'text-white' : 'text-gray-700'
                              )}
                            >
                              {message.text}
                            </p>
                          )}

                          <div className="mt-2 flex justify-end">
                            <span
                              className={cn(
                                'text-[11px]',
                                isMine ? 'text-white/80' : 'text-black'
                              )}
                            >
                              {format(parseISO(message.createdAt), 'hh:mm a')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="shrink-0 border-t px-4 sm:px-5 py-3 sm:py-4 bg-white">
                {selectedFile && (
                  <div className="mb-3 relative w-fit max-w-full">
                    {getFileKind(selectedFile) === 'image' ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="preview"
                        className="h-20 w-20 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2 pr-8 max-w-xs">
                        <FileText className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm truncate">{selectedFile.name}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={clearSelectedFile}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      aria-label="Remove attachment"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 sm:gap-3 w-full">
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept={ACCEPTED_FILE_TYPES}
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-11 w-11 text-black"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>

                  <Input
                    ref={messageInputRef}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Type your message"
                    className="flex-1 min-w-0 h-11 sm:h-12 rounded-full bg-white px-4"
                  />

                  <Button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="h-11 w-11 sm:h-12 sm:w-12 rounded-full shrink-0"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {selectedIsGroup && (
                <GroupMembersModal
                  open={membersModalOpen}
                  onClose={() => setMembersModalOpen(false)}
                  groupName={getConversationTitle(selectedConversation, currentUserId)}
                  members={selectedConversation.participants}
                />
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#F7F7F7]">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">Select a conversation</p>
                <p className="text-sm text-black mt-1">Start messaging with your users</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
