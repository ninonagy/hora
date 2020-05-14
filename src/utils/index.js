import CryptoJS from "crypto-js";

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

export { userToUserKey, arrayWithId, getPassHash };
