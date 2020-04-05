<template>
  <q-form @submit="submitForm">
    <q-input
      v-if="tab === 'register'"
      outlined
      class="q-mb-md"
      v-model="formData.name"
      label="Name"
    />
    <q-input
      outlined
      class="q-mb-md"
      v-model="formData.email"
      type="email"
      label="Email"
    />
    <q-input
      outlined
      class="q-mb-md"
      v-model="formData.password"
      type="password"
      label="Password"
    />
    <div class="row">
      <q-space />
      <q-btn color="primary" :label="tab" type="submit" />
    </div>
  </q-form>
</template>

<script>
export default {
  props: {
    tab: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: ""
      }
    };
  },
  methods: {
    submitForm() {
      if (this.tab === "login") {
        console.log("login");
      } else {
        console.log("register");
      }
    }
  }
};
</script>
