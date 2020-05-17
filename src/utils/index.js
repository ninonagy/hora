import CryptoJS from "crypto-js";

/*

Dates

0 - does not display anything
1 - displays time
2 - displays date and time

(it is not handling years (yet^^))

 */

var months = {
  1: "siječnja",
  2: "veljače",
  3: "ožujka",
  4: "travnja",
  5: "svibnja",
  6: "lipnja",
  7: "srpnja",
  8: "kolovoza",
  9: "rujna",
  10: "listopada",
  11: "studenog",
  12: "prosinca",
};

const showDate = (time) => {
  var today = new Date();
  if (today.getDate() == time.getDate() && today.getMonth() == time.getMonth())
    return "Danas";
  else if (
    today.getDate() - 1 == time.getDate() &&
    today.getMonth() == time.getMonth()
  )
    return "Jučer";
  else return time.getDate() + ". " + months[time.getMonth() + 1];
};

function userToUserKey(userIdOne, userIdTwo) {
  return userIdOne < userIdTwo ? userIdOne + userIdTwo : userIdTwo + userIdOne;
}

// Firestore helper functions

function arrayWithId(querySnapshot) {
  let array = [];
  let docs = querySnapshot.docs;
  docs.forEach((doc) => {
    array.push({ ...doc.data(), id: doc.id });
  });
  return array;
}

/* 
    We are aware storing passwords this way is
    far from perfect, but it is much easier to test things
    this way. It will be upgraded very soon.
*/

const getPassHash = (pass) => {
  const hash = CryptoJS.SHA256(pass);
  const secret_buffer = CryptoJS.enc.Base64.parse("secret");
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA512, secret_buffer);
  hmac.update(hash, secret_buffer);
  return hmac.finalize().toString(CryptoJS.enc.Base64);
};

// ...

export { userToUserKey, arrayWithId, getPassHash, showDate };
