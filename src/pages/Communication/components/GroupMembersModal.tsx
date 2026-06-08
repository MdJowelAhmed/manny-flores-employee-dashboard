import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ModalWrapper } from '@/components/common/ModalWrapper'
import { getImageUrl } from '@/components/common/getImageUrl'
import type { ChatParticipant } from '@/redux/slices/chatApi'

interface GroupMembersModalProps {
  open: boolean
  onClose: () => void
  groupName: string
  members: ChatParticipant[]
}

export function GroupMembersModal({
  open,
  onClose,
  groupName,
  members,
}: GroupMembersModalProps) {
  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Group Members"
      description={groupName}
      size="md"
    >
      <div className="space-y-2 py-1">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-3"
          >
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage
                src={member.profile ? getImageUrl(member.profile) : undefined}
                alt={member.name}
              />
              <AvatarFallback className="bg-primary/15 text-primary text-sm font-medium">
                {member.name?.charAt(0) ?? '?'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{member.name}</p>
              <p className="text-xs text-muted-foreground truncate">{member.email}</p>
            </div>
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              {member.role.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </ModalWrapper>
  )
}
