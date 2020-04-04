<template>
  <q-page class="flex column">
    <q-banner class="text-center bg-grey-4">
      User is offline.
    </q-banner>
    <div class="q-pa-md column col justify-end">
      <q-chat-message
        v-for="message in messages"
        :key="message.id"
        :name="message.from"
        :text="[message.text]"
        :sent="message.from === 'me'"
      />
    </div>
    <q-footer elevated>
      <q-toolbar class="q-py-sm">
        <q-input
          v-model="newMessage"
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
export default {
  name: "Chat",
  data() {
    return {
      newMessage: "",
      messages: [
        { id: "a01a5s", text: "Hey!", from: "me" },
        { id: "b5d22", text: "Hi!", from: "them" },
        { id: "ca321w", text: "Fine", from: "me" },
      ],
    };
  },
  methods: {
    sendMessage() {
      this.messages.push({
        text: this.newMessage,
        from: "me",
      });
    },
  },
};
</script>
