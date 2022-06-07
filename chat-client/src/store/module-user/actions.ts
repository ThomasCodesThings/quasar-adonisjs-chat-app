import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UserStateInterface } from './state';
import { userService } from 'src/services';
import { ChannelDetails, UserDetails, MessageDetails } from 'src/contracts/User';

const actions: ActionTree<UserStateInterface, StateInterface> = {
  async updateStatus({ commit }, details: UserDetails) {
    const user = await userService.updateStatus(details);
    commit('USER_CHANGE_STATUS', user);
    commit('USER_CURRENT_CHANNEL_MESSAGES', details.currentChannelMessages);
    return user;
  },
  async updateTyping({ commit }, details: MessageDetails) {
    const user = await userService.updateTyping(details);
    commit('USER_CURRENT_MESSAGE', user);
    return user;
  },
  async getChannels({ commit }, id: number) {
    const channels = await userService.getChannels(id);
    commit('USER_CHANNEL_LIST', channels);
    return channels;
  },
  async setCurrentChannel({ commit }, channel: ChannelDetails) {
    commit('SET_CURRENT_CHANNEL', channel);
  },
  async showChannelMembers({ commit }, open: boolean) {
    commit('SHOW_CHANNEL_MEMBERS', open);
  },
  async setTaggable({ commit }, isTaggable: boolean) {
    commit('SET_TAGGABLE', isTaggable);
  }
}
export default actions;
