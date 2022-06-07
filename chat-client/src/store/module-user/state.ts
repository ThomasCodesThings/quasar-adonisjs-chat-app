import { User } from 'src/contracts'
import { ChannelDetails, MessageDetails } from 'src/contracts/User';
export interface UserStateInterface {
  user: User | null,
  channels: ChannelDetails[],
  currentChannel: ChannelDetails | null,
  currentMessage: MessageDetails | null,
  currentChannelMessages: MessageDetails[] | null,
  status: 'online' | 'dnd' | 'offline',
  showChannelMembers: boolean,
  isTaggable: boolean,
  errors: { message: string, field?: string }[]
}

function state(): UserStateInterface {
  return {
    user: null,
    status: 'online',
    channels: [],
    currentChannel: null,
    currentMessage: null,
    currentChannelMessages: null,
    showChannelMembers: false,
    isTaggable: false,
    errors: []
  };
}

export default state;
