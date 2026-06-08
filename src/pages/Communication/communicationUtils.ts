import type { ChatConversation } from '@/redux/slices/chatApi'

export function isGroupChat(conversation: ChatConversation) {
  const hasGroupName = Boolean(conversation.groupName?.trim())
  return hasGroupName || conversation.participants.length > 1
}

export function getMemberCount(conversation: ChatConversation) {
  return conversation.participants.length
}

export function getOtherParticipants(conversation: ChatConversation, currentUserId?: string) {
  if (!currentUserId) return conversation.participants ?? []
  return (
    conversation.participants?.filter((participant) => participant.id !== currentUserId) ?? []
  )
}

export function getConversationTitle(conversation: ChatConversation, currentUserId?: string) {
  const groupName = conversation.groupName?.trim()
  if (groupName) return groupName

  const others = getOtherParticipants(conversation, currentUserId)
  if (others.length === 1) return others[0].name
  if (others.length > 1) {
    return others.map((participant) => participant.name).join(', ')
  }

  return conversation.participants?.[0]?.name || 'Conversation'
}

export function getConversationAvatar(conversation: ChatConversation, currentUserId?: string) {
  const others = getOtherParticipants(conversation, currentUserId)
  return others[0]?.profile ?? conversation.participants?.[0]?.profile ?? null
}

export function getLastMessagePreview(lastMessage: ChatConversation['lastMessage']) {
  const text = lastMessage?.text?.trim()
  return text || 'No messages yet'
}
