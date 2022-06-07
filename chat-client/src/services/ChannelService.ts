import type { AxiosError, AxiosRequestConfig } from 'axios'
import type { ChannelMessageBoundary, JoinChannelData, UserData, ChannelData, ChannelDetailsData, ChannelMemberData, MessageData } from 'src/contracts'
import { api } from 'src/boot/axios'

class ChannelService {
  async joinChannel(channelData : JoinChannelData): Promise<JoinChannelData> {
    const channel = await api.post('channel/join', channelData)
    return channel.data
  }

  async inviteUser(userData: UserData): Promise<UserData> {
    const channel = await api.post('channel/invite', userData)
    return channel.data
  }

  async revokeUser(userData: UserData): Promise<UserData> {
    const channel = await api.post('channel/revoke', userData)
    return channel.data
 }

 async kickUser(userData: UserData): Promise<UserData> {
    const channel = await api.post('channel/kick', userData)
    return channel.data
  }

  async quitChannel(channelData: ChannelData): Promise<ChannelData> {
    const channel = await api.post('channel/quit', channelData)
    return channel.data
  }

  async cancelChannel(channelData: ChannelData): Promise<ChannelData> {
    const channel = await api.post('channel/cancel', channelData)
    return channel.data
  }

  async acceptChannel(channelData: ChannelData): Promise<ChannelData> {
    const channel = await api.post(`channel/accept`, channelData)
    return channel.data
  }

  async getMembers(channelId: number): Promise<ChannelMemberData[]> {
      const members = await api.get(`channel/${channelId}/members`)
      return members.data
  }

  async addMessage(messageData: MessageData): Promise<MessageData> {
    const message = await api.post(`channel/${messageData.channel_id}/add`, messageData)
    return message.data
  }

  async getMessages(channelMessageDetails : ChannelMessageBoundary): Promise<MessageData[]> {
    const messages = await api.get(`channel/${channelMessageDetails.channelId}/messages/${channelMessageDetails.userId}/${channelMessageDetails.endingIndex}`)
    return messages.data
    }
}

export default new ChannelService()