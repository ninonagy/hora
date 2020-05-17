import React from "react";
import globalHook from "use-global-hook";

// https://www.npmjs.com/package/use-global-hook

const initialState = {
  user: undefined,
  userId: undefined,
  isAuthenticated: false,
};

const actions = {
  setAuthUser: (store, user) => {
    if (user) {
      store.setState({ user: user, userId: user.id, isAuthenticated: true });
    } else {
      store.setState({ user: null, userId: null, isAuthenticated: false });
    }
  },
  setUser: (store, user) => {
    // Update user's data in local storage
    localStorage.setItem("user", JSON.stringify(user));
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
