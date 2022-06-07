import type { AxiosError, AxiosRequestConfig } from 'axios'
import type { UserDetails, ChannelDetails, MessageDetails } from 'src/contracts/User'
import { api } from 'src/boot/axios'

class UserService {
  async updateStatus (userDetails: UserDetails): Promise<UserDetails> {
    const response = await api.post(`user/${userDetails.id}/status`, userDetails)
    return response.data
  }

async updateTyping (messageDetails: MessageDetails): Promise<MessageDetails> {
    const response = await api.post(`user/${messageDetails.id}/typing`, messageDetails)
    return response.data
}

  async getChannels (id: number): Promise<ChannelDetails[]> {
    const response = await api.get(`user/${id}/channels`)
    return response.data
  }
}

export default new UserService()