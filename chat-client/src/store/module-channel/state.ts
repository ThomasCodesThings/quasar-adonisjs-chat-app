import type { ChannelMemberData, MessageData } from "src/contracts";
export interface ChannelStateInterface {
  channelId: number;
  channelMembers: ChannelMemberData[];
  channelMessages: MessageData[];
  initialMessages: MessageData[];
  endingIndex: number;
}

function state(): ChannelStateInterface {
  return {
    channelId: 0,
    channelMembers: [],
    channelMessages: [],
    initialMessages: [],
    endingIndex: 10000
  };
}

export default state;
