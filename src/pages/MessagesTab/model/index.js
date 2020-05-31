import { Model } from "react-model";

import * as db from "../../../db";
import { fs } from "../../../firebase";

import { buildPath, paths, states, triggers, types } from "../../../scheme";

// Define model
const Conversation = {
  state: {
    senderId: undefined,
    receiverUser: undefined,
    conversationId: undefined,
    messageTextInput: "",
    messages: [],
    // alert modal
    alertModal: {
      isOpen: false,
      trigger: null,
      headerText: "",
      messageText: "",
      cancelButtonText: "",
      acceptButtonText: "",
      message: {},
    },
  },
  actions: {
    setUsers: async ({ senderId, conversationId }) => {
      let conversation = await db.getUserConversation(senderId, conversationId);
      let receiverUser = await db.getUser(conversation.receiverId);
      return (state) => {
        state.senderId = senderId;
        state.conversationId = conversationId;
        state.receiverUser = receiverUser;
      };
    },

    // Message interaction
    setMessages: (messages) => {
      return (state) => {
        state.messages = messages;
      };
    },
    setMessageTextInput: (value) => {
      return (state) => {
        state.messageTextInput = value.trim();
      };
    },
    clearMessageTextInput: () => {
      return (state) => {
        state.messageTextInput = "";
      };
    },
    markConversationAsSeen: async (_, { state }) => {
      const { senderId, conversationId } = state;
      await fs
        .doc(
          buildPath(paths.userConversation, {
            userId: senderId,
            conversationId,
          })
        )
        .update({
          seen: true,
        });
    },

    // Modal interaction
    closeAlertModal: () => {
      return (state) => {
        state.alertModal.isOpen = false;
      };
    },
    showAbortModal: ({ message, isThisUser }) => {
      return (state) => {
        state.alertModal = {
          isOpen: true,
          trigger: triggers.abort,
          headerText: isThisUser
            ? "Jesi li siguran da želiš odustati od usluge?"
            : "Jesi li siguran da želiš odbaciti pomoć?",
          messageText: "",
          cancelButtonText: "Ne",
          acceptButtonText: "Da",
          message: message,
        };
      };
    },
    showDeclineModal: ({ message, isThisUser }) => {
      return (state) => {
        state.alertModal = {
          isOpen: true,
          trigger: triggers.decline,
          headerText: "Jesi li siguran da želiš odbaciti pomoć?",
          messageText: "",
          cancelButtonText: "Ne",
          acceptButtonText: "Da",
          message: message,
        };
      };
    },
    showAcceptModal: ({ message, isThisUser }) => {
      return (state) => {
        state.alertModal = {
          isOpen: true,
          trigger: triggers.accept,
          headerText: "Želiš li prihvatiti pomoć?",
          messageText: "",
          cancelButtonText: "Ne",
          acceptButtonText: "Prihvati",
          message: message,
        };
      };
    },
    handleModalAccept: async (_, { state }) => {
      const { conversationId } = state;
      const { message, trigger } = state.alertModal;

      if (trigger === triggers.abort || trigger === triggers.decline) {
        // Set favor state from pending to free
        await db.setFavorState(message.favorId, states.favor.free);
      } else if (trigger === triggers.accept) {
        // Set favor state from pending to active
        await db.setFavorState(message.favorId, states.favor.active);
      }

      if (trigger === triggers.abort) {
        // Delete notification message
        await db.deleteMessage(conversationId, message.id);
      } else {
        // Mark notification message as activated
        await db.updateMessage(conversationId, message.id, {
          action: true,
        });
      }

      // Send small notification as a result of action
      await db.storeMessage(
        conversationId,
        {
          senderId: state.senderId,
          favorId: message.favorId,
          trigger: trigger,
        },
        types.message.smallNotification
      );
    },

    // Review modal action
    updateMessageWhenUserReview: async ({ message, userRole }, { state }) => {
      userRole === "owner"
        ? await db.updateMessage(state.conversationId, message.id, {
            ownerReviewed: true,
          })
        : await db.updateMessage(state.conversationId, message.id, {
            helperReviewed: true,
          });
    },
  },
};

// Register model
export const { useStore, subscribe, getState } = Model({ Conversation });
