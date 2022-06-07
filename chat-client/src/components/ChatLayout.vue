<template>
<q-layout>
         <q-toolbar>
          <q-toolbar-title> {{ channelName }}</q-toolbar-title>
        </q-toolbar>
         <q-scroll-area ref="scrollArea" style="height: 940px" @scroll="onScoll">
      <div v-for="message in channelMessages" :key="message.id" class="q-py-xs" reverse>
      <q-toolbar class="row">
        <q-card class="my-card col-grow bg-grey-3" flat>
           <q-card-section horizontal>
        <div class="text-h6"> {{ message.userNickname }} </div>
      </q-card-section>
      <q-card-section horizontal :class="message.isTagged == true ? 'bg-red-4' : 'bg-grey-3'">
       <p> {{ message.text }}</p>
      </q-card-section>
        <q-card-section horizontal>
       {{ message.createdAt }}
      </q-card-section>
    </q-card>
        </q-toolbar>
      </div>
    </q-scroll-area>
    <p>{{ currentTypingUsersMessage }}</p>
    <q-btn flat color="primary" disable :label="currentTypingUsersMessage"></q-btn>
    </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue"
import { useQuasar } from 'quasar'
var input = null
const scrollAreaRef = ref(null)
export default defineComponent({
  name: "ChatLayout",
  data () {
    return {
      message: '',
      loading: false,
      previousMessages: [],
      $q: useQuasar()
    }
  },
  computed:
  {
    channelName: function () {
      return this.$store.state.user.currentChannel != null ? this.$store.state.user.currentChannel.name : ''
    },
    channelMessages: function () {
      if (this.$store.state.user.status === 'offline') {
        return this.$store.state.user.currentChannelMessages
      }
      if (this.$store.state.user.currentChannel != null) {
        this.$store.dispatch('channel/getMessages', { channelId: this.$store.state.user.currentChannel.id, userId: this.$store.state.auth.user.id, endingIndex: this.$store.state.channel.endingIndex })
      }
      this.isNewMessage()
      return this.$store.state.channel.channelMessages
    },
    currentTypingUsersMessage: function () {
       if (this.$store.state.user.currentChannel !== null) {
        var currentTyping = []
        const users = this.$store.dispatch('channel/getMembers', this.$store.state.user.currentChannel.id)
        for (var i = 0; i < users.length; i++) {
          if (users[i].current_message.length > 0) {
            currentTyping.push(users[i].nickname)
            console.log("Found typing user!")
          }
        }
        if (currentTyping.length > 5) {
          return "Several people are typing..."
        } else if (currentTyping.length === 0) {
          return ""
        } else {
          return currentTyping.join(', ') + " are typing..."
        }
       }
       return ""
       }
  },
  methods: {
    isNewMessage() {
      if (this.$store.state.channel.initialMessages.length === 0) {
        return
      }
      //  console.log(this.$store.state.channel.channelMessages.length, this.$store.state.channel.initialMessages.length)
      var oldId = this.$store.state.channel.initialMessages[this.$store.state.channel.initialMessages.length - 1].id
      for (var i = 0; i < this.$store.state.channel.initialMessages.length; i++) {
        if (this.$store.state.channel.initialMessages[i].id > oldId) {
          oldId = this.$store.state.channel.initialMessages[i].id
        }
      }
      const newMessages = []
      for (var j = 0; j < this.$store.state.channel.channelMessages.length; j++) {
        if (this.$store.state.channel.channelMessages[j].id > oldId) {
          newMessages.push(this.$store.state.channel.channelMessages[j])
        }
      }
    for (var k = 0; k < newMessages.length; k++) {
      if ((newMessages[k].userNickname !== this.$store.state.auth.user.nickname && this.$store.state.user.status !== 'dnd') || (newMessages[k].isTagged && this.$store.state.user.isTaggable)) {
        this.$q.notify({
          message: newMessages[k].userNickname + ': ' + newMessages[k].text
        })
      }
    }
     this.$store.dispatch('channel/changeInitialMessages', this.$store.state.channel.channelMessages)
    },
    onScoll ({ verticalPercentage, verticalPosition }) {
      // check if scroll is at the bottom
      if (verticalPercentage > 0.9) {
        const scrollArea = this.$refs.scrollArea
        const scrollTarget = scrollArea.getScrollTarget()
        const previousScrollHeight = scrollTarget.verticalPosition
        scrollArea.setScrollPosition('vertical', scrollTarget.previousScrollHeight, 0)
        //  this.$store.dispatch('channel/updateIndex', this.$store.state.channel.endingIndex + 20)
        //  this.$store.dispatch('channel/getMessages', { channelId: this.$store.state.user.currentChannel.id, endingIndex: this.$store.state.channel.endingIndex })
      }
      console.log(this.$refs.scrollArea.getScrollTarget().scrollHeight, verticalPercentage)
        //  setTimeout(this.$store.dispatch('channel/updateIndex', this.$store.state.channel.endingIndex + 20), 1000)
    },
    loadMoreMessages () {
      if (this.$store.state.user.currentChannel != null) {
        this.$store.state.channel.endingIndex += 10
    }
    }
  }
}
)
</script>
