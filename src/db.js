import { fs } from "./firebase";

// https://capacitor.ionicframework.com/docs/apis/storage/
// import { Plugins } from "@capacitor/core";
// const { Storage } = Plugins;

var db = {
  // Used for showing profile page
  users: {
    u1: {
      name: "Stacey Scott",
      email: "stacey.scott@example.com",
      birthDate: "1996-02-03",
      location: "Zagreb",
      password: "coyote",
      rating: 3.9,
      timeSpent: 0,
      timeEarned: 3,
      skills: ["Matematika", "Umjetnik", "Plesanje"],
      pictureLink:
        "https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340",
      favorsCreated: {
        f1: true,
        f2: true,
      },
      conversations: {
        c1: {
          receiverId: "u3",
        },
        c2: {
          receiverId: "u2",
        },
      },
    },
    u2: {
      name: "Ron Lawrence",
      email: "ron.lawrence@example.com",
      birthDate: "2000-01-20",
      location: "Rijeka",
      password: "luv2epus",
      rating: 4.6,
      timeSpent: 0,
      timeEarned: 3,
      skills: ["Jezici", "Slikanje", "Sviranje"],
      pictureLink:
        "https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340",
      favorsCreated: {},
      conversations: {
        c3: {
          receiverId: "u4",
        },
      },
    },
    u3: {
      name: "Alexis Chavez",
      email: "alexis.chavez@example.com",
      birthDate: "1963-08-07",
      location: "Sesvete",
      password: "butkus",
      rating: 4.5,
      timeSpent: 0,
      timeEarned: 3,
      skills: ["Čitanje", "Čuvanje djece", "Trčanje"],
      pictureLink:
        "https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340",
      favorsCreated: {
        f3: true,
      },
    },
    u4: {
      name: "admin",
      email: "admin",
      birthDate: "2000-01-20",
      location: "Rijeka",
      password: "admin",
      rating: 5,
      timeSpent: 0,
      timeEarned: 100,
      skills: ["admin", "admin", "admin"],
      pictureLink:
        "https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340",
      favorsCreated: {},
      conversations: {
        c3: {
          receiverId: "u4",
        },
      },
    },
  },

  // Favors is a list for showing in search result
  // In future, seperate favors list on activeFavors and consumedFavors
  favors: {
    f1: {
      ownerId: "u1",
      title: "Zamjeniti žarulju u kući",
      description: "Trebam pomoć da se mi zamijeni žarulja u mojem stanu.",
      location: "Zagreb",
      dateCreated: "2020-04-22 21:58:30",
      dateDue: "2020-04-28 20:00:00",
    },
    f2: {
      ownerId: "u1",
      title: "Goodbye... Fancypants! Be a pal and tell me, Am I a good man? ",
      description:
        "Nosey parker. What? What?! WHAT?! People who talk about infallibility are usually on very shaky ground. No… No-no-no-no-wait-wait-wait-wait… I remember I'm-I-I… I'm with my father, we're lying back in the grass, it's a warm Gallifreyan night— Let's go in!",
      location: "Krk",
      dateCreated: "2020-04-20 08:20:58",
      dateDue: "2020-04-30 18:00:00",
    },
    f3: {
      ownerId: "u3",
      title: "Izrada Web stranice",
      description: "Treba mi pomoć oko dovršavanja dijela osobne web stranice.",
      location: "Sesvete",
      dateCreated: "2020-04-23 16:56:42",
      dateDue: "2020-05-01 16:00:00",
    },
  },

  // Active favor deals made by owner and some user
  // userId -> favorId
  // Used for showing active deals that each user has.
  // This data should be visible only to selected user and owner?
  // More fields needed for each connection (dealDate, timeLimit...)
  activeConnections: {
    u1: "f3",
    u2: "f1",
  },

  images: {
    f1: "data",
    f2: "data",
    f3: "data",
  },

  conversations: {
    c1: {
      msg_message1: {
        senderId: "u1",
        content: "I have a question... ",
        dateCreated: "2020-04-29 22:30:12",
      },
      msg_message2: {
        senderId: "u3",
        content: "Fire it! :D",
        dateCreated: "2020-04-29 22:43:19",
      },
    },
    c2: {
      msg_message3: {
        senderId: "u2",
        content: "Hey how's going? :D",
        dateCreated: "2020-04-29 20:43:19",
      },
      msg_message4: {
        senderId: "u2",
        content: "Happy Birthday Nino! 🎉🎉",
        dateCreated: "2020-04-29 20:43:30",
      },
      msg_message5: {
        senderId: "u1",
        content: "All fine, really happy :)",
        dateCreated: "2020-04-30 21:00:19",
      },
      msg_message6: {
        senderId: "u1",
        content: "Thanks! :D",
        dateCreated: "2020-04-30 21:00:20",
      },
    },
    c3: {
      msg_message7: {
        senderId: "u4",
        content: "hey waddup",
        dateCreated: "2020-04-29 20:43:19",
      },
      msg_message8: {
        senderId: "u2",
        content: "yo",
        dateCreated: "2020-04-29 20:43:30",
      },
      msg_message9: {
        senderId: "u4",
        content: "halo",
        dateCreated: "2020-04-30 21:00:19",
      },
      msg_message10: {
        senderId: "u2",
        content: "cool",
        dateCreated: "2020-04-30 21:00:20",
      },
      msg_message11: {
        senderId: "u2",
        content: "cool",
        dateCreated: "2020-04-30 21:00:20",
      },
      msg_message12: {
        senderId: "u2",
        content: "cool",
        dateCreated: "2020-04-30 21:00:20",
      },
    },
  },

  ratings: {},

  // ...
};

const paths = {
  user: "/users/{userId}",
  favor: "/favors/{favorId}",
  activeConnection: "/activeConnection/{userId}",
  // conversation: "/conversations/{conversationId}",
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
        return result.data();
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
  ).then(() => {
    return messageId;
  });
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
};
