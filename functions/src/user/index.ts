import { fs, functions } from "../utils";

function userToUserKey(userIdOne: string, userIdTwo: string) {
  return userIdOne < userIdTwo ? userIdOne + userIdTwo : userIdTwo + userIdOne;
}

function setConversationWithHoracije(userId: string) {
  const horacijeId = "horacije";
  const conversationId = userToUserKey(userId, "horacije");
  return fs
    .doc(`/conversations/${conversationId}`)
    .set({
      dateCreated: new Date().toISOString(),
    })
    .then(() => {
      return fs
        .doc(`/users/${horacijeId}/conversations/${conversationId}`)
        .set({
          active: true,
          receiverId: userId,
          dateCreated: new Date().toISOString(),
        })
        .then(() => {
          return fs
            .doc(`/users/${userId}/conversations/${conversationId}`)
            .set({
              active: true,
              receiverId: horacijeId,
              dateCreated: new Date().toISOString(),
            })
            .then(() => {
              return fs
                .doc(`/conversations/${conversationId}/messages/welcome`)
                .create({
                  senderId: horacijeId,
                  content: "Hej pozdrav, dobrodošao u Horu!",
                  type: "msg",
                  dateCreated: new Date().toISOString(),
                });
            });
        });
    });
}

// Handle user creation
// Give user initial coins and start conversation thread with Horacije bot
export const onUserCreate = functions.firestore
  .document("/users/{userId}")
  .onCreate((snapshot) => {
    const userId = snapshot.id;
    if (userId) {
      // Give user 3 coins
      const setInitialCoins = fs.doc(`/users/${userId}`).update({
        timeEarned: 3,
        timeSpent: 0,
      });
      return Promise.all([
        setInitialCoins,
        setConversationWithHoracije(userId),
      ]);
    }

    return "No userId set!";
  });
