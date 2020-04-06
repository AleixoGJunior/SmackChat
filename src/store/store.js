import Vue from "vue";
import { firebaseAuth, firebaseDb } from "boot/firebase";

let messagesRef;

const state = {
  userDetails: {},
  users: {},
  messages: {},
};

const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload;
  },
  addUser(state, payload) {
    Vue.set(state.users, payload.userId, payload.userDetails);
  },
  updateUser(state, payload) {
    Object.assign(state.users[payload.userId], payload.userDetails);
  },
  addMessage(state, payload) {
    Vue.set(state.messages, payload.messageId, payload.messageDetails);
  },
  clearMessages(state) {
    state.messages = {};
  },
};

const actions = {
  registerUser({}, payload) {
    const { name, email, password } = payload;

    firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response);

        const userId = firebaseAuth.currentUser.uid;

        firebaseDb.ref(`users/${userId}`).set({
          name,
          email,
          online: true,
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  },
  loginUser({}, payload) {
    const { email, password } = payload;

    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.message);
      });
  },
  logoutUser() {
    firebaseAuth.signOut();
  },
  handleAuthStateChanged({ commit, dispatch, state }) {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        const userId = firebaseAuth.currentUser.uid;

        firebaseDb.ref(`users/${userId}`).once("value", (snapshot) => {
          const { name, email } = snapshot.val();
          commit("setUserDetails", {
            name,
            email,
            userId,
          });
        });
        dispatch("firebaseUpdateUser", { userId, updates: { online: true } });
        dispatch("firebaseGetUsers");
        this.$router.push("/").catch(() => {});
      } else {
        dispatch("firebaseUpdateUser", {
          userId: state.userDetails.userId,
          updates: { online: false },
        });
        commit("setUserDetails", {});
        this.$router.replace("/auth").catch(() => {});
      }
    });
  },
  firebaseUpdateUser({}, payload) {
    const { userId, updates } = payload;

    firebaseDb.ref(`users/${userId}`).update(updates);
  },
  firebaseGetUsers({ commit }) {
    firebaseDb.ref("users").on("child_added", (snapshot) => {
      const userDetails = snapshot.val();
      const userId = snapshot.key;
      commit("addUser", {
        userId,
        userDetails,
      });
    });
    firebaseDb.ref("users").on("child_changed", (snapshot) => {
      const userDetails = snapshot.val();
      const userId = snapshot.key;
      commit("updateUser", {
        userId,
        userDetails,
      });
    });
  },
  firebaseGetMessages({ commit, state }, otherUserId) {
    const userId = state.userDetails.userId;
    messagesRef = firebaseDb.ref(`chats/${userId}/${otherUserId}`);

    messagesRef.on("child_added", (snapshot) => {
      const messageDetails = snapshot.val();
      const messageId = snapshot.key;
      commit("addMessage", {
        messageId,
        messageDetails,
      });
    });
  },
  firebaseStopGettingMessages({ commit }) {
    if (messagesRef) {
      messagesRef.off("child_added");
      commit("clearMessages");
    }
  },
  firebaseSendMessage({}, payload) {
    const userId = state.userDetails.userId;
    firebaseDb
      .ref(`chats/${userId}/${payload.otherUserId}`)
      .push(payload.message);

    payload.message.from = "them";
    firebaseDb
      .ref(`chats/${payload.otherUserId}/${userId}`)
      .push(payload.message);
  },
};

const getters = {
  users: (state) => {
    let usersFiltered = {};
    Object.keys(state.users).forEach((key) => {
      if (key !== state.userDetails.userId) {
        usersFiltered[key] = state.users[key];
      }
    });
    return usersFiltered;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
