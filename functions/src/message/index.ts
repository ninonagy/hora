import { fs, functions } from "../utils";

function getUserIdFromKey(key: string, otherUserId: string) {
  return key.split(otherUserId).filter((value) => value)[0];
}

// Handle new messages
// Update user conversation with time when last message is recorded and
// mark conversation thread as unseen
export const onMessageCreate = functions.firestore
  .document("/conversations/{conversationId}/messages/{messageId}")
  .onCreate((snapshot, context) => {
    let { conversationId, messageId } = context.params;
    if (conversationId === undefined && messageId === undefined) {
      messageId = snapshot.ref.id;
      conversationId = snapshot.ref.parent.parent?.id;
    }
    const senderId = snapshot.data()?.senderId;
    if (!senderId) return "No senderId set!";
    const receiverId = getUserIdFromKey(conversationId, senderId);
    if (!receiverId) return "No receiverId set!";
    // const updatedAt = snapshot.createTime?.toMillis();
    const updatedAt = Date.now();
    const updateUserConversation = fs
      .doc(`/users/${receiverId}/conversations/${conversationId}`)
      .update({
        seen: false,
        updatedAt,
      });
    return updateUserConversation;
  });
