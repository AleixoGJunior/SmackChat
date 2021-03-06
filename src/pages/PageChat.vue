<template>
  <q-page ref="pageChat" class="flex column page-chat">
    <q-banner
      v-if="!otherUserDetails.online"
      class="text-center bg-grey-4 fixed-top"
    >
      {{ otherUserDetails.name }} is offline.
    </q-banner>
    <div
      class="q-pa-md column col justify-end"
      :class="{ invisible: !showMessages }"
    >
      <q-chat-message
        v-for="(message, key) in messages"
        :key="key"
        :name="message.from === 'me' ? userDetails.name : otherUserDetails.name"
        :text="[message.text]"
        :sent="message.from === 'me'"
      />
    </div>
    <q-footer elevated>
      <q-toolbar class="q-py-sm">
        <q-input
          v-model="newMessage"
          ref="newMessage"
          class="full-width"
          outlined
          bg-color="white"
          rounded
          clearable
          clear-icon="close"
          label="Message"
        >
          <template v-slot:after>
            <q-btn
              rounde
              dense
              flat
              icon="send"
              color="white"
              @click="sendMessage"
            />
          </template>
        </q-input>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixinOtherUserDetails from "src/mixins/mixin-other-user-details";

export default {
  name: "Chat",
  mixins: [mixinOtherUserDetails],
  data() {
    return {
      newMessage: "",
      showMessages: false
    };
  },
  computed: {
    ...mapState("store", ["messages", "userDetails"])
  },
  methods: {
    ...mapActions("store", [
      "firebaseGetMessages",
      "firebaseStopGettingMessages",
      "firebaseSendMessage"
    ]),
    sendMessage() {
      this.firebaseSendMessage({
        message: {
          text: this.newMessage,
          from: "me"
        },
        otherUserId: this.$route.params.otherUserId
      });
      this.clearMessage();
    },
    clearMessage() {
      this.newMessage = "";
      this.$refs.newMessage.focus();
    },
    scrollToBottom() {
      const pageChat = this.$refs.pageChat.$el;
      setTimeout(() => {
        window.scrollTo(0, pageChat.scrollHeight);
      }, 20);
    }
  },
  watch: {
    messages: function(val) {
      if (Object.keys(val).length) {
        this.scrollToBottom();
        setTimeout(() => {
          this.showMessages = true;
        }, 200);
      }
    }
  },
  mounted() {
    this.firebaseGetMessages(this.$route.params.otherUserId);
  },
  destroyed() {
    this.firebaseStopGettingMessages();
  }
};
</script>
<style>
.q-banner {
  top: 50px;
  z-index: 2;
  opacity: 0.8;
}
</style>
