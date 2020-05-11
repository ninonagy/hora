// List of Firestore document and collection paths
const paths = {
  user: "/users/{userId}",
  favor: "/favors/{favorId}",
  activeConnection: "/activeConnection/{userId}",
  conversation: "/conversations/{conversationId}",
  userConversation: "/users/{userId}/conversations/{conversationId}",
  message: "/conversations/{conversationId}/messages/{messageId}",
  userFavorsCreated: "/users/{userId}/favorsCreated/{favorId}",
  userFavorsActive: "/users/{userId}/favorsActive/{favorId}",
  // ...
};

function buildPath(path = "", ids = {}) {
  for (let label in ids) {
    let idValue = ids[label];
    path = path.replace("{" + label + "}", idValue);
  }
  return path;
}

// States that are assigned to values
const states = {
  favor: {
    free: "free",
    pending: "pending",
    active: "active",
    done: "done",
  },
};

// Types
const types = {
  message: {
    message: "msg",
    notification: "notification",
  },
};

export { paths, buildPath, states, types };
