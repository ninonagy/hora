import { fs, storage } from "./firebase";

import { paths, buildPath, states } from "./scheme";
import { userToUserKey } from "./utils";

// https://capacitor.ionicframework.com/docs/apis/storage/
// import { Plugins } from "@capacitor/core";
// const { Storage } = Plugins;

function getValue(path = "", ids = {}) {
  path = buildPath(path, ids);
  let segments = path.split("/").filter((i) => i !== "/" && i !== "");
  // If segment count is even then get document
  if (segments.length % 2 === 0) {
    return fs
      .doc(path)
      .get()
      .then((result) => {
        return { ...result.data(), id: result.id };
      });
  }
  // Otherwise get collection
  else {
    return fs
      .collection(path)
      .get()
      .then((querySnapshot) => {
        let array = [];
        let docs = querySnapshot.docs;
        docs.forEach((doc) => {
          array.push({ ...doc.data(), id: doc.id });
        });
        return array;
      });
  }
}

function setValue(path = "", ids = {}, value = {}) {
  path = buildPath(path, ids);
  value = { ...value, dateCreated: new Date().toISOString() };
  return fs.doc(path).set(value);
}

function updateValue(path = "", ids = {}, value = {}) {
  path = buildPath(path, ids);
  return fs.doc(path).update(value);
}

function deleteDoc(path = "", ids = {}) {
  path = buildPath(path, ids);
  return fs.doc(path).delete();
}

// https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
function uid() {
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

// Database functions

async function getUser(id) {
  return getValue(paths.user, { userId: id });
}

async function updateUser(id, data = {}) {
  return updateValue(paths.user, { userId: id }, data).then(() => id);
}

async function getFavor(id) {
  return getValue(paths.favor, { favorId: id });
}

async function getFavorsList() {
  return getFavor("").then((data) => data);
}

async function createFavor(data = {}) {
  let favorId = uid();
  let ownerId = data.ownerId;
  data = { ...data, userId: null, state: states.favor.free };
  return setValue(paths.favor, { favorId }, data).then(() =>
    // Store favor key to user
    setValue(
      paths.userFavorsCreated,
      { userId: ownerId, favorId: favorId },
      {}
    ).then(() => favorId)
  );
}

async function updateFavor(favorId, data = {}) {
  return updateValue(paths.favor, { favorId }, data);
}

// Return validated user
async function getUserByAuth(email, password) {
  return getUser("").then((users) =>
    users.find((user) => user.email === email && user.password === password)
  );
}

// Start conversation thread
async function storeConversation(senderId, receiverId) {
  let id = userToUserKey(senderId, receiverId);
  let fields = { active: true };
  return setValue(paths.conversation, { conversationId: id }, {}).then(() =>
    setValue(
      paths.userConversation,
      { userId: senderId, conversationId: id },
      { receiverId: receiverId, ...fields }
    ).then(() => {
      return setValue(
        paths.userConversation,
        { userId: receiverId, conversationId: id },
        { receiverId: senderId, ...fields }
      ).then(() => id);
    })
  );
}

// Get all user's conversations
async function getUserConversationList(id) {
  return getValue(paths.userConversation, {
    userId: id,
    conversationId: "",
  }).then((conversations) => {
    return conversations;
  });
}

// Get user conversation
async function getUserConversation(id, conversationId) {
  return getValue(paths.userConversation, {
    userId: id,
    conversationId: conversationId,
  }).then((conversation) => conversation);
}

// Get all messages from conversation
async function getMessages(conversationId) {
  return getValue(paths.message, {
    conversationId: conversationId,
    messageId: "",
  });
}

// Store new message in conversation thread
async function storeMessage(conversationId, data = {}, type = "msg") {
  data = { ...data, type };
  let messageId = uid();
  return setValue(
    paths.message,
    { conversationId: conversationId, messageId: messageId },
    data
  ).then(() => messageId);
}

async function deleteMessage(conversationId, messageId) {
  return deleteDoc(paths.message, {
    conversationId,
    messageId,
  });
}

async function storeUser(data = {}) {
  data = { ...data };
  let userId = uid();
  return setValue(paths.user, { userId: userId }, data).then(() => userId);
}

// https://firebase.google.com/docs/storage/web/upload-files
async function storeUserPicture(userId, data = Blob) {
  return storage
    .ref(`/userPictures/${userId}.jpg`)
    .put(data)
    .then((snapshot) => snapshot.ref.getDownloadURL().then((url) => url));
}

async function setFavorState(favorId, state) {
  return updateValue(paths.favor, { favorId }, { state });
}

// ...

// export db functions
export {
  paths,
  buildPath,
  getUser,
  storeUser,
  updateUser,
  getFavor,
  updateFavor,
  setFavorState,
  createFavor,
  getFavorsList,
  getUserByAuth,
  getMessages,
  deleteMessage,
  storeConversation,
  storeMessage,
  getUserConversation,
  getUserConversationList,
  storeUserPicture,
};
