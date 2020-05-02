import * as firebase from "firebase";
import { devConfig } from "./config";

var app = firebase.initializeApp(devConfig);

var fs = firebase.firestore(app);

export { firebase, fs };
