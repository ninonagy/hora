/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { expect } from "chai";
// tslint:disable-next-line: no-import-side-effect
import "mocha";

import * as admin from "firebase-admin";
import * as functions from "firebase-functions-test";

// Cloud functions
import {
  onFavorStateChange,
  onFavorCreate,
  onUserCreate,
  onMessageCreate,
} from "../src/index";

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
  const wrappedOnUserCreate = testEnv.wrap(onUserCreate);
  const wrappedOnMessageCreate = testEnv.wrap(onMessageCreate);

  const Jojo = "u1"; // owner
  const Loki = "u2"; // user
  const favorId = "test_favor";
  const conversationId = `${Jojo}${Loki}`;
  const messageId = `new_message`;

  before(async () => {
    await admin.firestore().doc(`/users/${Jojo}`).delete();
    await admin.firestore().doc(`/users/${Loki}`).delete();
    await admin.firestore().doc(`/users/horacije`).delete();
    await admin.firestore().doc(`/favors/${favorId}`).delete();
    await admin.firestore().doc(`/conversations/horacije${Jojo}/messages/welcome`).delete();
    await admin.firestore().doc(`/conversations/horacije${Loki}/messages/welcome`).delete();
    await admin
      .firestore()
      .doc(`/users/${Loki}/conversations/${conversationId}`)
      .delete();
  });

  it("should create user Jojo", async () => {
    const id = await admin
      .firestore()
      .doc(`/users/${Jojo}`)
      .create({
        name: "Jojo",
      })
      .then(() => Jojo);
    expect(id).to.be.equal(Jojo);
  });

  it("should create user Loki", async () => {
    const id = await admin
      .firestore()
      .doc(`/users/${Loki}`)
      .create({
        name: "Loki",
      })
      .then(() => Loki);

    expect(id).to.be.equal(Loki);
  });

  it("should set initial coins", async () => {
    const snapJojo = testEnv.firestore.makeDocumentSnapshot(
      {
        name: Jojo,
        timeEarned: 0,
        timeSpent: 0,
      },
      `/users/${Jojo}`
    );
    const snapLoki = testEnv.firestore.makeDocumentSnapshot(
      {
        name: Loki,
        timeEarned: 0,
        timeSpent: 0,
      },
      `/users/${Loki}`
    );

    await wrappedOnUserCreate(snapJojo);
    await wrappedOnUserCreate(snapLoki);

    const userJojo = await admin.firestore().doc(`/users/${Jojo}`).get();
    const userLoki = await admin.firestore().doc(`/users/${Loki}`).get();

    expect(userJojo.data()?.timeEarned).to.be.equal(3);
    expect(userLoki.data()?.timeEarned).to.be.equal(3);
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
    const timeEarned = user.data()?.timeEarned;
    const timeSpent = user.data()?.timeSpent;
    expect(timeEarned).to.be.equal(3);
    expect(timeSpent).to.be.equal(1);
    expect(timeEarned - timeSpent).to.be.equal(2);
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
    const timeEarned = user.data()?.timeEarned;
    const timeSpent = user.data()?.timeSpent;
    expect(timeEarned).to.be.equal(4);
    expect(timeSpent).to.be.equal(0);
    expect(timeEarned - timeSpent).to.be.equal(4);
  });

  it("Jojo should send a message to Loki", async () => {
    const snapMsg = testEnv.firestore.makeDocumentSnapshot(
      {
        senderId: Jojo,
        receiverId: Loki,
        content: "Thank you!",
      },
      `/conversations/${conversationId}/messages/${messageId}`
    );

    // Create user conversation thread
    await admin
      .firestore()
      .doc(`/users/${Loki}/conversations/${conversationId}`)
      .create({
        dateCreated: new Date().toISOString(),
      });

    await wrappedOnMessageCreate(snapMsg);

    const update = await admin
      .firestore()
      .doc(`/users/${Loki}/conversations/${conversationId}`)
      .get();

    const user = await admin.firestore().doc(`/users/${Loki}`).get();

    expect(update.data()?.seen).to.be.false;
    expect(user.data()?.lastReceivedMsgId).to.be.equal(messageId);
  });
});
