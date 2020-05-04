import { fs, storage } from "./firebase";

// https://capacitor.ionicframework.com/docs/apis/storage/
// import { Plugins } from "@capacitor/core";
// const { Storage } = Plugins;

const paths = {
  user: "/users/{userId}",
  favor: "/favors/{favorId}",
  activeConnection: "/activeConnection/{userId}",
  conversation: "/conversations/{conversationId}",
  userConversation: "/users/{userId}/conversations/{conversationId}",
  message: "/conversations/{conversationId}/messages/{messageId}",
  userFavorsCreated: "/users/{userId}/favorsCreated/{favorId}",
  // ...
};

function buildPath(path = "", ids = {}) {
  // ids = { userId: "u1" };
  for (let label in ids) {
    let idValue = ids[label];
    path = path.replace("{" + label + "}", idValue);
  }
  return path;
}

function getValue(path = "", ids = {}) {
  if (path === "") return;
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
  if (path === "") return;
  path = buildPath(path, ids);
  return fs.doc(path).set(value);
}

function updateValue(path = "", ids = {}, value = {}) {
  if (path === "") return;
  path = buildPath(path, ids);
  return fs.doc(path).update(value);
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

async function setUser(data = {}) {
  let id = uid();
  return setValue(paths.user, { userId: id }, data).then(() => id);
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

async function storeFavor(data = {}) {
  let favorId = uid();
  let ownerId = data.ownerId;
  return setValue(paths.favor, { favorId: favorId }, data).then(() =>
    // Store favor key to user
    setValue(
      paths.userFavorsCreated,
      { userId: ownerId, favorId: favorId },
      {}
    ).then(() => favorId)
  );
}

// Return validated user
async function getUserByAuth(email, password) {
  return getUser("").then((users) =>
    users.find((user) => user.email === email && user.password === password)
  );
}

// Start conversation thread
async function storeConversation(senderId, receiverId) {
  debugger;
  let id = "";
  id = senderId < receiverId ? senderId + receiverId : receiverId + senderId;
  return setValue(paths.conversation, { conversationId: id }, {}).then(() =>
    setValue(
      paths.userConversation,
      { userId: senderId, conversationId: id },
      { receiverId: receiverId }
    ).then(() => {
      return setValue(
        paths.userConversation,
        { userId: receiverId, conversationId: id },
        { receiverId: senderId }
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
  data = { ...data, type, dateCreated: new Date().toISOString() };
  let messageId = uid();
  return setValue(
    paths.message,
    { conversationId: conversationId, messageId: messageId },
    data
  ).then(() => messageId);
}

// https://firebase.google.com/docs/storage/web/upload-files
async function storeUserPicture(userId, data = Blob) {
  return storage
    .ref(`/userPictures/${userId}.jpg`)
    .put(data)
    .then((snapshot) => snapshot.ref.getDownloadURL().then((url) => url));
}

// ...

// export db functions
export {
  paths,
  buildPath,
  getUser,
  setUser,
  getFavor,
  storeFavor,
  getFavorsList,
  getUserByAuth,
  getMessages,
  storeConversation,
  storeMessage,
  getUserConversation,
  getUserConversationList,
  storeUserPicture,
};
