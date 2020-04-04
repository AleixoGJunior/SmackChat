<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.fullPath.includes('/chat')"
          v-go-back.single
          dense
          icon="arrow_back"
          label="Back"
          flat
        />

        <q-toolbar-title class="absolute-center">{{ title }}</q-toolbar-title>

        <q-btn
          to="/auth"
          class="absolute-right q-pr-sm"
          dense
          icon="account_circle"
          label="Login"
          flat
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  computed: {
    title() {
      const { name } = this.$route;
      return name;
    },
  },
};
</script>
