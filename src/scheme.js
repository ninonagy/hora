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
  skills: "/lists/skills",
  review: "/user/{userId}/reviews/{reviewId}",
  // ...
};

function buildPath(path = "", ids = {}) {
  for (let label in ids) {
    let idValue = ids[label];
    path = path.replace("{" + label + "}", idValue);
  }
  return path;
}

// Favor states
const states = {
  favor: {
    free: "free",
    pending: "pending",
    active: "active",
    review: "review",
    done: "done",
  },
};

// Message types
const types = {
  message: {
    message: "msg",
    notification: "notification",
    smallNotification: "smallNotification",
  },
};

// Notification triggers
const triggers = {
  accept: "accept",
  decline: "decline",
  review: "review",
  abort: "abort",
  done: "done",
};

export { paths, buildPath, states, types, triggers };
