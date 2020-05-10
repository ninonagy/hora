/* eslint-disable @typescript-eslint/no-unused-vars */
import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp();
// const serviceAccount = require("../service-account.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://hora-app-develop.firebaseio.com",
// });

// const fs = admin.firestore();

// function setValue(path = "", ids = {}, value = {}) {
//   const data = { ...value, dateCreated: new Date().toISOString() };
//   return fs.doc(buildPath(path, ids)).set(data);
// }

// function updateValue(path = "", ids = {}, value = {}) {
//   return fs.doc(buildPath(path, ids)).update(value);
// }

// function deleteDoc(path = "", ids = {}) {
//   return fs.doc(buildPath(path, ids)).delete();
// }

//
// Admin db functions
// https://firebase.google.com/docs/functions/typescript
//

// Store favor to user's active favor list
// async function storeUserActiveFavor(userId: string, favorId: string) {
//   return setValue(paths.userFavorsActive, { userId, favorId }, {});
// }

// ...

//
// Cloud Firestore trigger functions
//

// Handle favor state change
export const onFavorStateChange = functions.firestore
  .document("/favor/{favorId}")
  .onUpdate((change, context) => {
    if (change.before) {
      const prevValue = change.before.data();
      const newValue = change.after.data();

      const stateOld = prevValue?.state;
      const stateNew = newValue?.state;

      // State must be changed
      if (stateOld !== stateNew) {
        // const { favorId } = context.params;

        // const { userId } = newValue && newValue?.userId;

        switch (stateNew) {
          case "free":
            if (stateOld === "pending") {
              // TODO: Notify user that owner rejected his request
            } else if (stateOld === "active") {
              // TODO: Notify owner that user quited from doing favor
            }
            return "free";
          case "pending":
            if (stateOld === "free") {
              // TODO: Notify owner that he needs to accept favor request
            }
            return "pending";
          case "active":
            if (stateOld === "pending") {
              // TODO: Notify user that owner accepted his favor request
            }
            return "active";
          case "done":
            if (stateOld === "active") {
              // TODO: Notify owner that user completed favor
              // TODO: Owner sends a coin
              // TODO: User receives a coin
            }
            return "done";
          default:
            console.log("No state change!");
            break;
        }
      }
    }

    return;
  });

// ...
