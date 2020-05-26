import { fs, functions } from "../utils";

export const onTempReviewCreate = functions.firestore
  .document("/users/{userId}/tempReviews/{reviewId}")
  .onCreate(async (snapshot, context) => {
    let { userId, reviewId } = context.params;
    if (userId === undefined && reviewId === undefined) {
      userId = snapshot.ref.id;
      reviewId = snapshot.ref.parent.parent?.id;
    }

    const receiverId = userId;
    const senderId = snapshot.data()?.senderId;
    const favorId = snapshot.data()?.favorId;

    const senderFromPath = `/users/${senderId}/tempReviews/${receiverId}_${favorId}`;
    const senderToPath = `/users/${senderId}/reviews/${receiverId}_${favorId}`;
    const receiverFromPath = `/users/${receiverId}/tempReviews/${senderId}_${favorId}`;
    const receiverToPath = `/users/${receiverId}/reviews/${senderId}_${favorId}`;

    // Check if sender has also review in his collection
    const senderReview = await fs.doc(senderFromPath).get();
    if (senderReview.exists) {
      const senderData = senderReview.data();
      const receiverData = snapshot.data();
      if (senderData && receiverData) {
        // Move data from tempReview to review path
        const setSenderReview = fs.doc(senderToPath).set(senderData);
        const setReceiverReview = fs.doc(receiverToPath).set(receiverData);
        // Delete temp reviews
        const deleteTemp = fs
          .doc(senderFromPath)
          .delete()
          .then(() => {
            return fs.doc(receiverFromPath).delete();
          });
        const setFavorStateDone = fs.doc(`/favors/${favorId}`).update({
          state: "done",
        });
        return Promise.all([
          setSenderReview,
          setReceiverReview,
          deleteTemp,
          setFavorStateDone,
        ]);
      }
    }

    return "No match yet!";
  });
