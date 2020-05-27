import CryptoJS from "crypto-js";

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

function showDate(dateCreated) {
  if (dateCreated) {
    const date = new Date(dateCreated);
    const today = new Date();
    if (
      today.getDate() == date.getDate() &&
      today.getMonth() == date.getMonth()
    )
      return `Danas`;
    else if (
      today.getDate() - 1 == date.getDate() &&
      today.getMonth() == date.getMonth()
    )
      return `Jučer`;
    else return `${date.getDate()}. ${months[date.getMonth() + 1]}`;
  }
}

function showTime(dateCreated) {
  const date = new Date(dateCreated);

  return `${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${
    date.getMinutes() < 10 ? "0" : ""
  }${date.getMinutes()}`;
}

function userToUserKey(userIdOne, userIdTwo) {
  return userIdOne < userIdTwo ? userIdOne + userIdTwo : userIdTwo + userIdOne;
}

// Firestore helper function

function arrayWithId(querySnapshot) {
  let array = [];
  let docs = querySnapshot.docs;
  docs.forEach((doc) => {
    array.push({ ...doc.data(), id: doc.id });
  });
  return array;
}

function showStarsDescription(rating) {
  var description;
  switch (rating) {
    case 1:
      description = "Užasno";
      break;
    case 2:
      description = "Loše";
      break;
    case 3:
      description = "Ispod očekivanja";
      break;
    case 4:
      description = "Očekivano";
      break;
    case 5:
      description = "Iznad očekivanja";
  }
  return description;
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

export {
  userToUserKey,
  arrayWithId,
  getPassHash,
  showDate,
  showTime,
  showStarsDescription,
};
