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

// ...

export { userToUserKey, arrayWithId };
