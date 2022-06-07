import { MutationTree } from 'vuex';
import { UserStateInterface } from './state';

const mutation: MutationTree<UserStateInterface> = {
  USER_CHANGE_STATUS (state, user) {
    state.user = user;
    state.status = user.status;
  },
  USER_CHANNEL_LIST (state, channels) {
    state.channels = channels;
  },
  USER_CURRENT_MESSAGE (state, message) {
    state.currentMessage = message;
  },
  SET_CURRENT_CHANNEL (state, channel) {
    state.currentChannel = channel;
  },
  SHOW_CHANNEL_MEMBERS (state, open) {
    state.showChannelMembers = open;
  },
  USER_CURRENT_CHANNEL_MESSAGES (state, messages) {
    state.currentChannelMessages = messages;
  },
  SET_TAGGABLE (state, isTaggable) {
    state.isTaggable = isTaggable;
  }
};

export default mutation;
