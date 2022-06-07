import { MutationTree } from 'vuex';
import { ChannelStateInterface } from './state';

const mutation: MutationTree<ChannelStateInterface> = {
  CHANNEL_MEMBERS (state, members) {
    state.channelMembers = members;
  },
  CHANNEL_MESSAGES (state, messages) {
    state.channelMessages = messages;
  },
  CHANNEL_MESSAGE_BOUNDARY (state, index) {
    state.endingIndex = index;
  },
  CHANNEL_INITIAL_MESSAGES (state, messages) {
    state.initialMessages = messages;
  }
};

export default mutation;
