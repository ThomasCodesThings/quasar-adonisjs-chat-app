<template>
<q-footer reveal bordered class="">
  <q-toolbar class="bg-grey-1 text-black col-grow">
    <p class="text-h6">Current status</p>
    <q-space></q-space>
    <q-badge rounded :color="statusColor"></q-badge>
    <q-space></q-space>
    <q-btn-dropdown class="col-grow bg-grey-5" label="Change">
        <q-list>
        <q-item v-if="this.statusColor != 'green'" clickable v-close-popup @click="onItemClick('online')">
        <q-toolbar class="bg-grey-4 text-black row">
          <q-item-section>
            <q-item-label>Onlline</q-item-label>
          </q-item-section>
           <q-badge rounded color="green"></q-badge>
           </q-toolbar>
        </q-item>

        <q-item v-if="this.statusColor != 'yellow'" clickable v-close-popup @click="onItemClick('dnd')">
         <q-toolbar class="bg-grey-4 text-black row">
          <q-item-section>
            <q-item-label>Do not disturb</q-item-label>
          </q-item-section>
           <q-badge rounded color="yellow"></q-badge>
            </q-toolbar>
        </q-item>

        <q-item v-if="this.statusColor != 'grey'" clickable v-close-popup @click="onItemClick('offline')">
         <q-toolbar class="bg-grey-4 text-black row">
          <q-item-section>
            <q-item-label>Offline</q-item-label>
          </q-item-section>
           <q-badge rounded color="grey"></q-badge>
            </q-toolbar>
        </q-item>
      </q-list>
      </q-btn-dropdown>
      <p>Tag notifications</p>
      <q-btn-dropdown class="bg-grey-5" label="Change">
        <q-list>
        <q-item clickable v-close-popup @click="onTagClick(true)">
        <q-toolbar class="bg-grey-4 text-black row">
          <q-item-section>
            <q-item-label>Yes</q-item-label>
          </q-item-section>
           </q-toolbar>
        </q-item>
        <q-item clickable v-close-popup @click="onTagClick(false)">
         <q-toolbar class="bg-grey-4 text-black row">
          <q-item-section>
            <q-item-label>No</q-item-label>
          </q-item-section>
            </q-toolbar>
        </q-item>
      </q-list>
      </q-btn-dropdown>
  </q-toolbar>
    </q-footer>
</template>

<script>
import { defineComponent } from 'vue'
const statusOptions = {
  online: "green",
  dnd: "yellow",
  offline: "grey"
}
var statusColor = "green"
export default defineComponent({
  name: 'UserSettings',
  data () {
    return {
      statusOptions,
      statusColor: statusOptions[this.$store.state.auth.user.status],
      isTaggable: false
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user ? this.$store.state.auth.user : null
    }
  },
  methods: {
    onItemClick (item) {
      const userDetails = {
        id: this.currentUser.id,
        status: item,
        currentChannelMessages: this.$store.state.channel.channelMessages !== null ? this.$store.state.channel.channelMessages : []
      }
      console.log(userDetails)
      this.$store.dispatch('user/updateStatus', userDetails)
      this.statusColor = this.statusOptions[item]
    },
    onTagClick (value) {
    this.$store.dispatch('user/setTaggable', value)
  }
  }
})
</script>
