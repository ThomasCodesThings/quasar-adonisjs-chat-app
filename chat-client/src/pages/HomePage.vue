<template>
  <q-layout view="hhh lpr fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="forum" @click="toggleLeftDrawer"/>

        <q-toolbar-title v-if="currentUser !== null">
          {{ currentUser.nickname }}
        </q-toolbar-title>
        <q-btn dense flat round icon="people" @click="toggleRightDrawer"/>
         <q-btn dense flat round icon="logout" @click="logout"/>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" show-if-above elevated width="450">
         <ChannelList v-if="leftDrawerOpen"></ChannelList>
    </q-drawer>
    <q-drawer v-model="rightDrawerOpen" side="right" show-if-above elevated>
      <MemberList v-if="rightDrawerOpen"> </MemberList>
    </q-drawer>
  <q-footer reveal bordered class="bg-grey-8 text-white">
        <q-toolbar class="bg-grey-3 text-black row">
         <q-input v-model="message" @change="onChange" @keydown.enter="send" class="col-grow" outlined placeholder="Enter a message" />
          <q-btn :disable="loading" @click="send" flat icon="send"/>
          </q-toolbar>
    </q-footer>
    <q-page-container>
      <ChatLayout v-show="showChat"></ChatLayout>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue"
import ChannelList from 'components/ChannelList.vue'
import MemberList from 'components/MemberList.vue'
import ChatLayout from 'components/ChatLayout.vue'
export default defineComponent({
  name: "HomePage",
  data () {
    return {
      currentUser: this.$store.state.auth.user,
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      message: '',
      loading: false
    }
  },
  components: {
    ChannelList,
    MemberList,
    ChatLayout
  },
  computed:
  {
    showChat: function () {
      return this.$store.state.user.currentChannel !== null
    }
  },
  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    toggleRightDrawer () {
      this.rightDrawerOpen = !this.rightDrawerOpen
    },
    parser (command) {
      if (this.message.length < command.length) {
        return null;
      }
      if (this.message.substring(0, command.length) === command) {
        var args = this.message.substring(command.length);
        if (args.length > 0 && args[0] === ' ') {
          return {
            command: command,
            args: args.substring(1)
          }
        } else {
          return {
            command: command,
            args: null
          }
        }
      }
      return null
    },
    async send() {
      var parsedData = null;
      this.loading = true;
      const commands = ['/join', '/invite', '/leave', '/revoke', '/kick', '/quit', '/cancel', '/list'];
      for (let i = 0; i < commands.length; i++) {
        parsedData = this.parser(commands[i]);
        if (parsedData !== null && parsedData.command !== null) {
          break;
        }
      }
      if (parsedData === null) {
        // Threat as normal message
        if (this.$store.state.user.currentChannel !== null) {
          await this.$store.dispatch('channel/addMessage', {
            channel_id: this.$store.state.user.currentChannel.id,
            user_creator_id: this.$store.state.auth.user.id,
            text: this.message
          })
        }
        this.message = ''
        this.loading = false;
        return;
      }
      var args;
      if (parsedData.args !== null) {
        args = parsedData.args.split(' ');
      }
      switch (parsedData.command) {
        case ('/join') :
          this.$store.dispatch('channel/joinChannel', {
            channel_name: args[0],
            channel_owner_user_id: this.$store.state.auth.user.id,
            channel_is_private: args.length > 1 && args[1] === 'private'
          })
          break;
        case ('/invite') :
          if (this.$store.state.user.currentChannel !== null) {
            this.$store.dispatch('channel/inviteUser', {
              channel_id: this.$store.state.user.currentChannel.id,
              sender_id: this.$store.state.auth.user.id,
              nickname: args[0]
            })
          }
          break;
        case ('/revoke'):
          if (this.$store.state.user.currentChannel !== null) {
            this.$store.dispatch('channel/revokeUser', {
              channel_id: this.$store.state.user.currentChannel.id,
              sender_id: this.$store.state.auth.user.id,
              nickname: args[0]
            })
          }
          break;
        case ('/kick'):
          if (this.$store.state.user.currentChannel !== null) {
            this.$store.dispatch('channel/kickUser', {
              channel_id: this.$store.state.user.currentChannel.id,
              sender_id: this.$store.state.auth.user.id,
              nickname: args[0]
            })
          }
          break;
        case ('/quit'):
          if (this.$store.state.user.currentChannel !== null) {
            this.$store.dispatch('channel/quitChannel', {
              channel_id: this.$store.state.user.currentChannel.id,
              sender_id: this.$store.state.auth.user.id
            })
          }
          break;
        case ('/cancel'):
          if (this.$store.state.user.currentChannel !== null) {
            this.$store.dispatch('channel/cancelChannel', {
              channel_id: this.$store.state.user.currentChannel.id,
              sender_id: this.$store.state.auth.user.id
            })
          }
          break;
        case ('/list'):
          this.$store.dispatch('user/showChannelMembers', {
            open: true
          })
          break;
      }
      this.message = '';
      this.loading = false;
    },
     onChange: function () {
      this.$store.dispatch('user/updateTyping', {
        id: this.$store.state.auth.user.id,
        message: this.message
      })
    },
    logout () {
      this.$store.dispatch('auth/logout').then(() => this.$router.push({ name: 'login' }))
    }
  }
  }
)
</script>
