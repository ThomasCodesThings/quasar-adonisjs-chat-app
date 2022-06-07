<template>
<q-toolbar class="row">
        <q-expansion-item
        label="Members"
        default-opened="false"
        expand-icon-toggle="false"
        switch-toggle-side="true"
        duration="100"
        @click="loadMembers"
        class="col-grow"
        :hidden="showChannelMembers"
      >
      <div v-for="member in channelMembers" :key="member.id">
        <q-toolbar class="text-black row">
           <q-badge rounded :color="statusColor[member.status]"></q-badge>
          <q-btn flat :color="member.current_message.length != 0 ? 'red' : 'black'" :label= "member.nickname" align="left" class="full-width" no-caps @click="details = member.current_message.length > 0"></q-btn>
          </q-toolbar>
          <q-dialog v-model="details">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Current message</div>
          <q-space></q-space>
          <q-btn icon="close" flat round dense v-close-popup></q-btn>
        </q-card-section>
        <q-card-section>
          {{ member.current_message }}
        </q-card-section>
      </q-card>
    </q-dialog>
          </div>
      </q-expansion-item>
      <q-btn flat color="primary" icon="close" @click="close"></q-btn>
      </q-toolbar>
</template>

<script>
import { defineComponent } from "vue"
import UserSettings from 'components/UserSettings.vue'

const statusColor = {
  online: 'green',
  dnd: 'yellow',
  offline: 'grey'
}
export default defineComponent({
  name: "ChannelList",
  data() {
    return {
      details: false,
      statusColor
    }
  },
  computed:
   {
     channelMembers: function () {
       this.loadMembers()
       return this.$store.state.channel.channelMembers
     },
     showChannelMembers: function () {
        return !this.$store.state.user.showChannelMembers
     }
   },
   methods: {
     loadMembers() {
       if (this.$store.state.user.currentChannel !== null) {
        this.$store.dispatch('channel/getMembers', this.$store.state.user.currentChannel.id)
       }
      },
      close () {
        this.$store.dispatch('user/showChannelMembers', {
          open: false
        })
      }
   }
}
)
</script>
