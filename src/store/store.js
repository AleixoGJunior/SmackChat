import { firebaseAuth, firebaseDb } from "boot/firebase";

const state = {
  userDetails: {},
};

const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload;
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
  handleAuthStateChanged({ commit }) {
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
      } else {
        commit("setUserDetails", {});
      }
    });
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
