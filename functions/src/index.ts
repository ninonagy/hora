/* eslint-disable @typescript-eslint/no-unused-vars */
import * as functions from "firebase-functions";

// For interaction with firestore database
import * as admin from "firebase-admin";
admin.initializeApp();

const fs = admin.firestore();

function setUserNotification(userId: String, data: Object) {
  return fs
    .collection(`/users/${userId}/notifications`)
    .add({ ...data, dateCreated: new Date().toISOString() });
}

// Handle favor state change
export const onFavorStateChange = functions.firestore
  .document("/favors/{favorId}")
  .onUpdate((change, context) => {
    if (change.before.exists && change.after.exists) {
      const prevValue = change.before.data();
      const newValue = change.after.data();

      const stateOld = prevValue?.state;
      const stateNew = newValue?.state;

      // State must be changed
      if (stateOld !== stateNew) {
        const { favorId } = context.params;
        const ownerId = newValue?.ownerId;
        const userId = newValue?.userId;

        switch (stateNew) {
          case "free":
            if (stateOld === "pending") {
              // TODO: Notify user that owner rejected his request
              const notification = setUserNotification(userId, {
                favorId: favorId,
                status: "rejected",
              });
              return Promise.all([notification]);
            } else if (stateOld === "active") {
              // TODO: Notify owner that user quited from doing favor
              const notification = setUserNotification(ownerId, {
                favorId: favorId,
                status: "canceled",
              });
              return Promise.all([notification]);
            }
            break;
          case "pending":
            if (stateOld === "free") {
              // TODO: Notify owner that he needs to accept favor request
              const notification = setUserNotification(ownerId, {
                favorId: favorId,
                status: "pending",
              });
              return Promise.all([notification]);
            }
            break;
          case "active":
            if (stateOld === "pending") {
              // Notify user that owner accepted his favor request
              const notification = setUserNotification(userId, {
                favorId: favorId,
                status: "accepted",
              });
              return Promise.all([notification]);
            }
            break;
          case "done":
            if (stateOld === "active") {
              // TODO: Notify owner that user completed favor
              // TODO: Owner sends a coin
              // TODO: User receives a coin
              const notification = setUserNotification(ownerId, {
                favorId: favorId,
                status: "completed",
              });
              return Promise.all([notification]);
            }
            break;
          default:
            console.log("No state change!");
            break;
        }
      }
    }

    return;
  });

// ...
