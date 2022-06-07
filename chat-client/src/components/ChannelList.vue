<template>
<div class="row">
    <div class="col*auto">
 <q-expansion-item
        label="Channels"
        default-opened="true"
        expand-icon-toggle="false"
        duration="100"
      >
      <div v-for="channel in channels" :key="channel.id">
          <div class="row">
                <div class="col-auto">
        <q-btn v-if="channel.isPrivate == false" flat icon="public" disable></q-btn>
        <q-btn v-if="channel.isPrivate == true" flat icon="lock" disable></q-btn>
      </div>
            <div>
        <q-btn flat :color="channel.isInvited ? 'purple' : 'black'" :label= "channel.name" align="left" class="full-width" no-caps @click="onSwap(channel)"></q-btn>
      </div>

 <div class="col-auto">
        <q-btn flat icon="exit_to_app" @click="onLeave(channel.id)"></q-btn>
      </div>
      <div class="col-auto">
        <q-btn v-if="isAdmin(channel.channelOwnerUserId)" flat icon="delete_forever" @click="onDelete(channel.id)"></q-btn>
      </div>
    </div>
    </div>
      </q-expansion-item>
      </div>

      <div class="col-auto">
           <q-btn flat color="primary" icon="add" @click="layout = true"></q-btn>
      </div>
</div>
<q-form ref="channelForm" class="q-gutter-md">
 <q-dialog v-model="layout">
      <q-layout view="Lhh lpR fff" container class="bg-white">
       <div class="text-h6">Create new channel</div>
    <div>
        <q-separator></q-separator>
    </div>
    <q-input v-model="channelForm.channel_name" label="Name of channel" hint="Maximum of 20 characters"
    filled
    lazy-rules
        :rules="[ val => val && val !== null || 'Enter name of new channel!',
        val => val && val.length > 0 && val.length <= 20 || 'Invalid length (max 20 characters)']"
      ></q-input>

      <q-checkbox v-model="channelForm.channel_is_private" label="Private channel"></q-checkbox>

      <div>
        <q-btn label="Create channel" type="submit" color="primary" @click="onSubmit"></q-btn>
      </div>
      </q-layout>
    </q-dialog>
    </q-form>

      <UserSettings></UserSettings>
</template>

<script>
import { defineComponent } from "vue"
import UserSettings from 'components/UserSettings.vue'

var newChannelName = ''
export default defineComponent({
  name: "ChannelList",
  data () {
    return {
      layout: false,
      channelForm: {
        channel_name: '',
        channel_owner_user_id: this.$store.state.auth.user.id,
        channel_is_private: false
      }

    }
  },
  components: {
    UserSettings
  },
  computed:
  {
    channels: function () {
      this.$store.dispatch('user/getChannels', this.$store.state.auth.user.id)
      return this.$store.state.user.channels
    }
  },
  methods: {
    onSubmit () {
      this.layout = false
      this.$store.dispatch('channel/joinChannel', this.channelForm)
    },
    onLeave(id) {
      this.$store.dispatch('channel/cancelChannel', {
            channel_id: id,
            sender_id: this.$store.state.auth.user.id
          })
    },
    onDelete(id) {
      this.$store.dispatch('channel/quitChannel', {
            channel_id: id,
            sender_id: this.$store.state.auth.user.id
          })
    },
    isAdmin(id) {
      return this.$store.state.auth.user.id === id
    },
    onSwap (channel) {
      this.$store.dispatch('user/setCurrentChannel', channel)
      this.$store.dispatch('channel/setInitialMessages', { channelId: this.$store.state.user.currentChannel.id, endingIndex: this.$store.state.channel.endingIndex })
      if (channel.isInvited) {
        this.$store.dispatch('channel/acceptChannel', {
          channel_id: channel.id,
          sender_id: this.$store.state.auth.user.id
        })
      }
    }
  }
}
)
</script>
