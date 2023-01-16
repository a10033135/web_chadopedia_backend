import { GetterTree, MutationTree, ActionTree } from "vuex";

interface BackendUser {
  uid: String;
  email: String;
  emailVerified: String;
}

interface RootState {
  user: BackendUser | null;
}

export const state = (): RootState => ({
  user: null,
});

export const getters: GetterTree<RootState, RootState> = {
  isAuthenticated: (state: RootState) => state.user !== null,
};

export const mutations: MutationTree<RootState> = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, _claims }) => {
    console.log('onAuthStateChangedMutation: '+authUser);
    
    if (authUser) {
      const { uid, email, emailVerified } = authUser;
      state.user = { uid, email, emailVerified };
    } else {
      state.user = null;
    }
  },
};
