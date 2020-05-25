import * as firebase from "firebase";
import { devConfig } from "./config";

var app = firebase.initializeApp(devConfig);

var fs = firebase.firestore(app);
var storage = firebase.storage(app);

const FieldValue = firebase.firestore.FieldValue;

// TODO: Setup for local emulator
// https://firebase.google.com/docs/emulator-suite/connect_and_prototype?database=Firestore
// fs.settings({
//   host: "localhost:8080",
//   ssl: false,
// });

export { fs, storage, firebase, FieldValue };
