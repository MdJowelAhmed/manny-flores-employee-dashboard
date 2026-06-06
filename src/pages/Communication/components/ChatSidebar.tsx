import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getImageUrl } from '@/components/common/getImageUrl'
import { cn } from '@/utils/cn'
import type { ChatConversation } from '@/redux/slices/chatApi'

interface ChatSidebarProps {
  conversations: ChatConversation[]
  selectedId: string | null
  onSelect: (id: string) => void
  myId: string
  isLoading: boolean
}

function formatLastMessageTime(iso: string) {
  const date = parseISO(iso)
  if (isToday(date)) return format(date, 'hh:mm a')
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'dd MMM')
}

function getChatTitle(conversation: ChatConversation, myId: string) {
  if (conversation.groupName?.trim()) return conversation.groupName
  const others = conversation.participants.filter((p) => p.id !== myId)
  return others.map((p) => p.name).join(', ') || 'Chat'
}

function getChatAvatarParticipant(conversation: ChatConversation, myId: string) {
  return conversation.participants.find((p) => p.id !== myId) ?? conversation.participants[0]
}

function getLastMessagePreview(
  conversation: ChatConversation,
  myId: string
) {
  const last = conversation.lastMessage
  if (!last) return 'No messages yet'
  const prefix = last.senderId === myId ? 'You: ' : ''
  const text = last.text?.trim() || 'Sent an attachment'
  return `${prefix}${text}`
}

export function ChatSidebar({
  conversations,
  selectedId,
  onSelect,
  myId,
  isLoading,
}: ChatSidebarProps) {
  return (
    <aside className="w-full sm:w-80 lg:w-96 shrink-0 border-r border-gray-100 flex flex-col bg-white">
      <div className="px-5 py-4 border-b border-gray-100 shrink-0">
        <h2 className="text-lg font-semibold text-accent">Messages</h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="px-4 py-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-gray-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-gray-100 animate-pulse" />
                  <div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
                </div>
              </div>
            </div>
          ))
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 opacity-40" />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const participant = getChatAvatarParticipant(conversation, myId)
            const isSelected = conversation.id === selectedId

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelect(conversation.id)}
                className={cn(
                  'w-full px-4 py-3 border-b border-gray-50 text-left transition-colors',
                  isSelected ? 'bg-primary/10' : 'hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-11 w-11 shrink-0">
                    <AvatarImage
                      src={
                        participant?.profile
                          ? getImageUrl(participant.profile)
                          : undefined
                      }
                      alt={participant?.name}
                    />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                      {getChatTitle(conversation, myId).charAt(0) ?? '?'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-accent truncate">
                        {getChatTitle(conversation, myId)}
                      </p>
                      {conversation.lastMessage?.createdAt && (
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          {formatLastMessageTime(conversation.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {getLastMessagePreview(conversation, myId)}
                    </p>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </aside>
  )
}
