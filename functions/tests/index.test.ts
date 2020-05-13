/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { expect } from "chai";
// tslint:disable-next-line: no-import-side-effect
import "mocha";

import * as admin from "firebase-admin";
import * as functions from "firebase-functions-test";

// Cloud functions
import { onFavorStateChange, onFavorCreate } from "../src/index";

// Connect to local firestore emulator
// Start emulator -> firebase emulators:start --only firestore
admin.firestore().settings({
  host: "localhost:8080",
  ssl: false,
});

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
describe("Favor life cycle test", () => {
  const wrapped = testEnv.wrap(onFavorStateChange);
  const wrappedOnFavorCreate = testEnv.wrap(onFavorCreate);
  const Jojo = "u1"; // owner
  const Loki = "u2"; // user
  const favorId = "test_favor";

  it("should create user Jojo", async () => {
    const id = await admin
      .firestore()
      .doc(`/users/${Jojo}`)
      .set({
        name: "Jojo",
        timeSpent: 0,
        timeEarned: 3,
      })
      .then(() => Jojo);
    expect(id).to.be.equal(Jojo);
  });

  it("should create user Loki", async () => {
    const id = await admin
      .firestore()
      .doc(`/users/${Loki}`)
      .set({
        name: "Loki",
        timeSpent: 0,
        timeEarned: 3,
      })
      .then(() => Loki);
    expect(id).to.be.equal(Loki);
  });

  it("Jojo should create new favor", async () => {
    const snap = testEnv.firestore.makeDocumentSnapshot(
      {
        ownerId: Jojo,
        state: "free",
        userId: null,
      },
      `/favors/${favorId}`
    );
    await wrappedOnFavorCreate(snap);
  });

  it("should take one coin from Jojo", async () => {
    const user = await admin.firestore().doc(`/users/${Jojo}`).get();
    expect(user.data()?.timeSpent).to.be.equal(1);
    expect(user.data()?.timeEarned).to.be.equal(2);
  });

  it("Loki should be able to send favor request", async () => {
    await admin.firestore().doc(`/favors/${favorId}`).update({
      userId: Loki,
      state: "pending",
    });
  });

  it("should notify Jojo that he needs to accept favor request", async () => {
    const beforeSnap = testEnv.firestore.makeDocumentSnapshot(
      {
        ownerId: Jojo,
        state: "free",
        userId: Loki,
      },
      `/favors/${favorId}`
    );
    const afterSnap = testEnv.firestore.makeDocumentSnapshot(
      {
        ownerId: Jojo,
        state: "pending",
        userId: Loki,
      },
      `/favors/${favorId}`
    );
    const change = testEnv.makeChange(beforeSnap, afterSnap);

    // Run cloud function
    await wrapped(change, { params: { favorId } });

    const result = await admin
      .firestore()
      .collection(`/users/${Jojo}/notifications`)
      .orderBy("dateCreated", "desc")
      .get();

    const notification = result.docs[0].data();
    expect(notification.status).to.be.equal("pending");
  });

  it("should notify Loki that Jojo accepted his favor request", async () => {
    const beforeSnap = testEnv.firestore.makeDocumentSnapshot(
      {
        ownerId: Jojo,
        state: "pending",
        userId: Loki,
      },
      `/favors/${favorId}`
    );
    const afterSnap = testEnv.firestore.makeDocumentSnapshot(
      {
        ownerId: Jojo,
        state: "active",
        userId: Loki,
      },
      `/favors/${favorId}`
    );
    const change = testEnv.makeChange(beforeSnap, afterSnap);

    // Run cloud function
    await wrapped(change, { params: { favorId } });

    const result = await admin
      .firestore()
      .collection(`/users/${Loki}/notifications`)
      .orderBy("dateCreated", "desc")
      .get();

    const notification = result.docs[0].data();
    expect(notification.status).to.be.equal("accepted");
  });

  it("Loki should be able to tell Jojo that he finished doing favor", async () => {
    await admin.firestore().doc(`/favors/${favorId}`).update({
      state: "review",
    });
  });

  it("should notify Jojo that Loki completed favor", async () => {
    const beforeSnap = testEnv.firestore.makeDocumentSnapshot(
      {
        ownerId: Jojo,
        state: "review",
        userId: Loki,
      },
      `/favors/${favorId}`
    );
    const afterSnap = testEnv.firestore.makeDocumentSnapshot(
      {
        ownerId: Jojo,
        state: "done",
        userId: Loki,
      },
      `/favors/${favorId}`
    );
    const change = testEnv.makeChange(beforeSnap, afterSnap);

    // Run cloud function
    await wrapped(change, { params: { favorId } });

    const result = await admin
      .firestore()
      .collection(`/users/${Loki}/notifications`)
      .orderBy("dateCreated", "desc")
      .get();

    const notification = result.docs[0].data();
    expect(notification.status).to.be.equal("completed");
  });

  it("should give one coin to Loki", async () => {
    const user = await admin.firestore().doc(`/users/${Loki}`).get();
    expect(user.data()?.timeEarned).to.be.equal(4);
    expect(user.data()?.timeSpent).to.be.equal(0);
  });
});
