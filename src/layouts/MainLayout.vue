<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.fullPath.includes('/chat')"
          class="absolute-left"
          v-go-back.single
          dense
          icon="arrow_back"
          label="Back"
          flat
        />

        <q-toolbar-title class="absolute-center">{{ title }}</q-toolbar-title>

        <q-btn
          v-if="!userDetails.userId"
          to="/auth"
          class="absolute-right q-pr-sm"
          dense
          icon="account_circle"
          label="Login"
          flat
          no-caps
        />

        <q-btn
          v-else
          @click="logoutUser"
          class="absolute-right q-pr-sm"
          dense
          icon="account_circle"
          flat
          no-caps
          >Logout<br />{{ userDetails.name }}</q-btn
        >
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixinOtherUserDetails from "src/mixins/mixin-other-user-details";

export default {
  mixins: [mixinOtherUserDetails],
  computed: {
    ...mapState("store", ["userDetails"]),
    title() {
      const { name } = this.$route;
      if (name === "Chat") {
        return this.otherUserDetails.name;
      }
      return name;
    },
  },
  methods: {
    ...mapActions("store", ["logoutUser"]),
  },
};
</script>

<style>
.platform-ios .q-header .q-btn,
.q-toolbar__title {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

.q-toolbar .q-btn {
  line-height: 1.2;
}
</style>
