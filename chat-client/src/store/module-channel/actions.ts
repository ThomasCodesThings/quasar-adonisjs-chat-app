import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ChannelStateInterface } from './state';
import { channelService } from 'src/services';
import { ChannelMessageBoundary, JoinChannelData, UserData, ChannelData, MessageData } from 'src/contracts';
const actions: ActionTree<ChannelStateInterface, StateInterface> = {
  async joinChannel({ commit }, channelData : JoinChannelData) {
    const channel = await channelService.joinChannel(channelData);
    //  commit('CHANNEL_JOIN', channel);
    return channel;
  },
  async inviteUser({ commit }, userData : UserData) {
    const channel = await channelService.inviteUser(userData);
    //  commit('CHANNEL_JOIN', channel);
    return channel;
  },
  async revokeUser({ commit }, userData : UserData) {
    const channel = await channelService.revokeUser(userData);
    //  commit('CHANNEL_JOIN', channel);
    return channel;
  },
  async kickUser({ commit }, userData : UserData) {
    const channel = await channelService.kickUser(userData);
    //  commit('CHANNEL_JOIN', channel);
    return channel;
  },
  async quitChannel({ commit }, channelData : ChannelData) {
    const channel = await channelService.quitChannel(channelData);
    //  commit('CHANNEL_JOIN', channel);
    return channel;
  },
  async cancelChannel({ commit }, channelData : ChannelData) {
    const channel = await channelService.cancelChannel(channelData);
    //  commit('CHANNEL_JOIN', channel);
    return channel;
  },
  async acceptChannel({ commit }, channelData : ChannelData) {
    const channel = await channelService.acceptChannel(channelData);
    return channel
  },
  async getMembers({ commit }, channelId: number) {
    const members = await channelService.getMembers(channelId);
    commit('CHANNEL_MEMBERS', members);
    return members;
  },
  async addMessage ({ commit }, messageData: MessageData) {
    const message = await channelService.addMessage(messageData);
    // commit('CHANNEL_MESSAGE', message);
    return message;
  },
  async getMessages({ commit }, channelMessageBoundary: ChannelMessageBoundary) {
    const messages = await channelService.getMessages(channelMessageBoundary);
    commit('CHANNEL_MESSAGES', messages);
    commit('CHANNEL_MESSAGE_BOUNDARY', channelMessageBoundary.endingIndex);
    return messages;
  },
  async updateIndex({ commit }, endingIndex: number) {
    commit('CHANNEL_MESSAGE_BOUNDARY', endingIndex);
  },
  async setInitialMessages({ commit }, channelMessageBoundary: ChannelMessageBoundary) {
    const messages = await channelService.getMessages(channelMessageBoundary);
    commit('CHANNEL_INITIAL_MESSAGES', messages);
    return messages;
  },
  async changeInitialMessages({ commit }, messages: MessageData[]) {
    commit('CHANNEL_INITIAL_MESSAGES', messages);
  }
}

export default actions;
