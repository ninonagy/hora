import React from "react";
import globalHook from "use-global-hook";

// https://www.npmjs.com/package/use-global-hook

const initialState = {
  userId: undefined,
  // userId: "u1", // testing
  user: undefined,
};

const actions = {
  setAuthUser: (store, userId) => {
    // const userId = store.state.userId;
    store.setState({ userId: userId });
  },
  setUser: (store, user) => {
    store.setState({ user: user });
  },
};

const useGlobal = globalHook(React, initialState, actions);

export default useGlobal;
