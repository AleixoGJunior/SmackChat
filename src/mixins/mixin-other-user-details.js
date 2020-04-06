export default {
  computed: {
    otherUserDetails() {
      const otherUserDetails = this.$store.state.store.users[
        this.$route.params.otherUserId
      ];

      if (otherUserDetails) {
        return otherUserDetails;
      }
      return {};
    },
  },
};
