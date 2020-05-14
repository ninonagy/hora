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

const incrementValue = admin.firestore.FieldValue.increment(1.0);
const decrementValue = admin.firestore.FieldValue.increment(-1.0);

// Handle new favor
export const onFavorCreate = functions.firestore
  .document("/favors/{favorId}")
  .onCreate((snapshot) => {
    const ownerId = snapshot.data()?.ownerId;
    if (ownerId) {
      // Take one coin from the user
      return fs.doc(`/users/${ownerId}`).update({
        timeSpent: incrementValue,
      });
    }

    return "No ownerId set!";
  });

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

        const from = (oldState: String) => {
          return {
            to: (newState: String) => {
              return stateOld === oldState && stateNew === newState;
            },
          };
        };

        if (from("free").to("pending")) {
          // Notify owner that he needs to accept favor request
          const notification = setUserNotification(ownerId, {
            favorId: favorId,
            status: "pending",
          });
          return Promise.all([notification]);
        } else if (from("pending").to("free")) {
          // Notify user that owner rejected his request
          const notification = setUserNotification(userId, {
            favorId: favorId,
            status: "rejected",
          });
          return Promise.all([notification]);
        } else if (from("active").to("free")) {
          // Notify owner that user quited from doing favor
          const notification = setUserNotification(ownerId, {
            favorId: favorId,
            status: "canceled",
          });
          // Give back a coin
          const coinUpdate = fs.doc(`/users/${ownerId}`).update({
            timeSpent: decrementValue,
          });
          return Promise.all([notification, coinUpdate]);
        } else if (from("pending").to("active")) {
          // Notify user that owner accepted his favor request
          const notification = setUserNotification(userId, {
            favorId: favorId,
            status: "accepted",
          });
          return Promise.all([notification]);
        } else if (from("active").to("review")) {
          // Notify owner that he needs to review user's work
          const notification = setUserNotification(ownerId, {
            favorId: favorId,
            status: "review",
          });
          return Promise.all([notification]);
        } else if (from("review").to("done")) {
          // Notify user that owner gave him one coin
          const notification = setUserNotification(userId, {
            favorId: favorId,
            status: "completed",
          });
          // Give user a coin
          const coinUpdate = fs.doc(`/users/${userId}`).update({
            timeEarned: incrementValue,
          });
          return Promise.all([notification, coinUpdate]);
        }
      }
    }

    return "No state change!";
  });

// ...
