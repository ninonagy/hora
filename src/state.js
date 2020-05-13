import React from "react";
import globalHook from "use-global-hook";

// https://www.npmjs.com/package/use-global-hook

const initialState = {
  userId: undefined,
  // userId: "u1", // testing
  user: undefined,
  isAuthenticated: false,
};

const actions = {
  setAuthUser: (store, userId) => {
    // const userId = store.state.userId;
    store.setState({ userId: userId, isAuthenticated: true });
  },
  setUser: (store, user) => {
    store.setState({ user: user });
  },
  getUserAvailableTime: (store) => {
    let availableTime = null;
    if (store.state.isAuthenticated) {
      const { timeEarned, timeSpent } = store.state.user;
      return timeEarned - timeSpent;
    }
    return availableTime;
  },
};

const useGlobal = globalHook(React, initialState, actions);

export default useGlobal;
