import React from 'react';
import globalHook from 'use-global-hook';

// https://www.npmjs.com/package/use-global-hook

const initialState = {
  // userId: undefined,
  userId: 'u1' // testing
};

const actions = {
  setAuthUser: (store, userId) => {
    // const userId = store.state.userId;
    store.setState({ userId: userId });
  }
};

const useGlobal = globalHook(React, initialState, actions);

export default useGlobal;
