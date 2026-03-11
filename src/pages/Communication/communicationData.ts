export type ConversationType = 'customer' | 'employee'

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  text: string
  timestamp: string
  isOutgoing: boolean
  isRead?: boolean
}

export interface Conversation {
  id: string
  type: ConversationType
  name: string
  avatar?: string
  lastMessage: string
  lastMessageIsFromYou?: boolean
  lastMessageTime: string
  messages: Message[]
}

export const mockCustomerConversations: Conversation[] = [
  {
    id: 'c1',
    type: 'customer',
    name: 'Marc Marquez',
    avatar: 'https://i.pravatar.cc/150?u=marc',
    lastMessage: "I don't know what you're...",
    lastMessageIsFromYou: false,
    lastMessageTime: '12:50PM',
    messages: [
      {
        id: 'm1',
        senderId: 's1',
        senderName: 'Edward Davidson',
        senderAvatar: 'https://i.pravatar.cc/150?u=edward',
        text: 'Hi! I need to discuss pool cleaning for my backyard. Can you help?',
        timestamp: '10:08',
        isOutgoing: false,
        isRead: true,
      },
      {
        id: 'm2',
        senderId: 'me',
        senderName: 'You',
        text: "Of course! I'd be happy to help. What's the size of your pool?",
        timestamp: '10:10',
        isOutgoing: true,
        isRead: true,
      },
      {
        id: 'm3',
        senderId: 's1',
        senderName: 'David Wayne',
        senderAvatar: 'https://i.pravatar.cc/150?u=david',
        text: "It's about 20 by 40 feet. The pool is in good condition, just needs regular cleaning.",
        timestamp: '10:12',
        isOutgoing: false,
        isRead: true,
      },
      {
        id: 'm4',
        senderId: 'me',
        senderName: 'You',
        text: 'Perfect! I can schedule a weekly cleaning. Does Monday work for you?',
        timestamp: '10:15',
        isOutgoing: true,
        isRead: true,
      },
      {
        id: 'm5',
        senderId: 'me',
        senderName: 'You',
        text: 'Great, see you then!',
        timestamp: '10:16',
        isOutgoing: true,
        isRead: true,
      },
    ],
  },
  {
    id: 'c2',
    type: 'customer',
    name: 'Imogen',
    avatar: 'https://i.pravatar.cc/150?u=imogen',
    lastMessage: 'Kisses! 👋',
    lastMessageIsFromYou: false,
    lastMessageTime: '08:20PM',
    messages: [
      {
        id: 'm6',
        senderId: 's2',
        senderName: 'Imogen',
        senderAvatar: 'https://i.pravatar.cc/150?u=imogen',
        text: 'Thanks for the great service!',
        timestamp: '08:15',
        isOutgoing: false,
      },
      {
        id: 'm7',
        senderId: 'me',
        senderName: 'You',
        text: 'You\'re welcome! Glad we could help.',
        timestamp: '08:18',
        isOutgoing: true,
      },
    ],
  },
  {
    id: 'c3',
    type: 'customer',
    name: 'Alex Thompson',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    lastMessage: 'You: Why?',
    lastMessageIsFromYou: true,
    lastMessageTime: '02:00PM',
    messages: [],
  },

 
  {
    id: 'c4',
    type: 'customer',
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?u=emma4',
    lastMessage: 'When can you schedule the repair?',
    lastMessageIsFromYou: false,
    lastMessageTime: '01:45PM',
    messages: [],
  },
  {
    id: 'c5',
    type: 'customer',
    name: 'James Brown',
    avatar: 'https://i.pravatar.cc/150?u=james5',
    lastMessage: 'You: I will confirm by tomorrow.',
    lastMessageIsFromYou: true,
    lastMessageTime: '01:20PM',
    messages: [],
  },
  {
    id: 'c6',
    type: 'customer',
    name: 'Sophia Davis',
    avatar: 'https://i.pravatar.cc/150?u=sophia6',
    lastMessage: 'Thanks for the quick response!',
    lastMessageIsFromYou: false,
    lastMessageTime: '12:30PM',
    messages: [],
  },
  {
    id: 'c7',
    type: 'customer',
    name: 'Michael Johnson',
    avatar: 'https://i.pravatar.cc/150?u=michael7',
    lastMessage: 'You: The estimate is ready.',
    lastMessageIsFromYou: true,
    lastMessageTime: '11:15AM',
    messages: [],
  },
  {
    id: 'c8',
    type: 'customer',
    name: 'Olivia Martinez',
    avatar: 'https://i.pravatar.cc/150?u=olivia8',
    lastMessage: 'Can we reschedule for next week?',
    lastMessageIsFromYou: false,
    lastMessageTime: '10:50AM',
    messages: [],
  },
  // {
  //   id: 'c9',
  //   type: 'customer',
  //   name: 'William Garcia',
  //   avatar: 'https://i.pravatar.cc/150?u=william9',
  //   lastMessage: 'You: Sure, no problem.',
  //   lastMessageIsFromYou: true,
  //   lastMessageTime: '10:30AM',
  //   messages: [],
  // },
  // {
  //   id: 'c10',
  //   type: 'customer',
  //   name: 'Isabella Rodriguez',
  //   avatar: 'https://i.pravatar.cc/150?u=isabella10',
  //   lastMessage: 'I have some questions about the quote.',
  //   lastMessageIsFromYou: false,
  //   lastMessageTime: '09:45AM',
  //   messages: [],
  // },
  // {
  //   id: 'c11',
  //   type: 'customer',
  //   name: 'Benjamin Lee',
  //   avatar: 'https://i.pravatar.cc/150?u=benjamin11',
  //   lastMessage: 'You: I sent the details via email.',
  //   lastMessageIsFromYou: true,
  //   lastMessageTime: '09:20AM',
  //   messages: [],
  // },
  // {
  //   id: 'c12',
  //   type: 'customer',
  //   name: 'Charlotte White',
  //   avatar: 'https://i.pravatar.cc/150?u=charlotte12',
  //   lastMessage: 'The service was excellent!',
  //   lastMessageIsFromYou: false,
  //   lastMessageTime: '08:55AM',
  //   messages: [],
  // },
  // {
  //   id: 'c13',
  //   type: 'customer',
  //   name: 'Henry Harris',
  //   avatar: 'https://i.pravatar.cc/150?u=henry13',
  //   lastMessage: 'You: Glad to hear that.',
  //   lastMessageIsFromYou: true,
  //   lastMessageTime: '08:40AM',
  //   messages: [],
  // },
  // {
  //   id: 'c14',
  //   type: 'customer',
  //   name: 'Amelia Clark',
  //   avatar: 'https://i.pravatar.cc/150?u=amelia14',
  //   lastMessage: 'Need help with landscaping.',
  //   lastMessageIsFromYou: false,
  //   lastMessageTime: '08:10AM',
  //   messages: [],
  // },
  // {
  //   id: 'c15',
  //   type: 'customer',
  //   name: 'Lucas Lewis',
  //   avatar: 'https://i.pravatar.cc/150?u=lucas15',
  //   lastMessage: 'You: I will call you shortly.',
  //   lastMessageIsFromYou: true,
  //   lastMessageTime: '07:30AM',
  //   messages: [],
  // },

]

export const mockEmployeeConversations: Conversation[] = [
  {
    id: 'e1',
    type: 'employee',
    name: 'Sarah Miller',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    lastMessage: 'I can start the job tomorrow.',
    lastMessageIsFromYou: false,
    lastMessageTime: '11:30AM',
    messages: [
      {
        id: 'em1',
        senderId: 'e1',
        senderName: 'Sarah Miller',
        senderAvatar: 'https://i.pravatar.cc/150?u=sarah',
        text: 'Hi, I\'ve completed the inspection at 123 Main St.',
        timestamp: '11:25',
        isOutgoing: false,
      },
      {
        id: 'em2',
        senderId: 'me',
        senderName: 'You',
        text: 'Great, please send the report.',
        timestamp: '11:28',
        isOutgoing: true,
      },
    ],
  },

  
  {
    id: 'e2',
    type: 'employee',
    name: 'David Park',
    avatar: 'https://i.pravatar.cc/150?u=david-e2',
    lastMessage: 'On my way to the site.',
    lastMessageIsFromYou: false,
    lastMessageTime: '11:00AM',
    messages: [],
  },
  {
    id: 'e3',
    type: 'employee',
    name: 'Jennifer Adams',
    avatar: 'https://i.pravatar.cc/150?u=jennifer-e3',
    lastMessage: 'You: Please update the schedule.',
    lastMessageIsFromYou: true,
    lastMessageTime: '10:30AM',
    messages: [],
  },
  {
    id: 'e4',
    type: 'employee',
    name: 'Robert Kim',
    avatar: 'https://i.pravatar.cc/150?u=robert-e4',
    lastMessage: 'Job completed successfully.',
    lastMessageIsFromYou: false,
    lastMessageTime: '09:45AM',
    messages: [],
  },
  {
    id: 'e5',
    type: 'employee',
    name: 'Linda Chen',
    avatar: 'https://i.pravatar.cc/150?u=linda-e5',
    lastMessage: 'You: Great work!',
    lastMessageIsFromYou: true,
    lastMessageTime: '09:20AM',
    messages: [],
  },
  {
    id: 'e6',
    type: 'employee',
    name: 'Thomas Wright',
    avatar: 'https://i.pravatar.cc/150?u=thomas-e6',
    lastMessage: 'Need supplies for tomorrow.',
    lastMessageIsFromYou: false,
    lastMessageTime: '08:50AM',
    messages: [],
  },
  {
    id: 'e7',
    type: 'employee',
    name: 'Nancy Scott',
    avatar: 'https://i.pravatar.cc/150?u=nancy-e7',
    lastMessage: 'You: I will order them.',
    lastMessageIsFromYou: true,
    lastMessageTime: '08:30AM',
    messages: [],
  },
  {
    id: 'e8',
    type: 'employee',
    name: 'Daniel Hall',
    avatar: 'https://i.pravatar.cc/150?u=daniel-e8',
    lastMessage: 'Customer requested a follow-up visit.',
    lastMessageIsFromYou: false,
    lastMessageTime: '08:00AM',
    messages: [],
  },

]