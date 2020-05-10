/* eslint-disable @typescript-eslint/no-unused-vars */

// firebase emulators:exec --only firestore 'npm test'

import { expect } from "chai";
import "mocha";

import * as admin from "firebase-admin";
import * as functions from "firebase-functions-test";

// Cloud functions
import { onFavorStateChange } from "../src/index";

const testEnv = functions(
  {
    databaseURL: "https://hora-app-develop.firebaseio.com",
    projectId: "hora-app-develop",
    storageBucket: "hora-app-develop.appspot.com",
  },
  "./service-account.json"
);

// https://firebase.google.com/docs/reference/functions/test

// Tests
describe("Cloud function", () => {
  const wrapped = testEnv.wrap(onFavorStateChange);
  const favorId = "test_favor";

  it("create favor", async () => {
    const id = await admin
      .firestore()
      .doc(`/favor/${favorId}`)
      .set({
        status: "free",
        ownerId: "u1",
      })
      .then(() => favorId);
    expect(id).to.be.equal(favorId);
  });

  it("change from free to pending", async () => {
    // Make snapshot for state of database beforehand
    const beforeSnap = testEnv.firestore.makeDocumentSnapshot(
      {
        status: "free",
        ownerId: "u1",
      },
      `/favor/${favorId}`
    );
    // Make snapshot for state of database after the change
    const afterSnap = testEnv.firestore.makeDocumentSnapshot(
      {
        status: "pending",
        ownerId: "u1",
      },
      `/favor/${favorId}`
    );
    const change = testEnv.makeChange(beforeSnap, afterSnap);
    // Call wrapped function with the Change object
    let data = await wrapped(change);
    expect(data).to.be.equal("pending");
  });
});
