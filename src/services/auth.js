import { getUserByAuth } from "../db";

export const authService = {
  login,
  logout,
  getUserValue: function () {
    return JSON.parse(localStorage.getItem("user"));
  },
};

function login(email, password) {
  return getUserByAuth(email, password).then((user) => {
    // store user details in local storage to keep user logged in between page refreshes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    return user;
  });
}

function logout() {
  // remove user from local storage
  localStorage.removeItem("user");
}
