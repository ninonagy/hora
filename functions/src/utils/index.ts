/* eslint-disable @typescript-eslint/no-unused-vars */
import * as functions from "firebase-functions";

// For interaction with firestore database
import * as admin from "firebase-admin";
admin.initializeApp();

const fs = admin.firestore();

const incrementValue = admin.firestore.FieldValue.increment(1.0);
const decrementValue = admin.firestore.FieldValue.increment(-1.0);

export { functions, fs, incrementValue, decrementValue };
