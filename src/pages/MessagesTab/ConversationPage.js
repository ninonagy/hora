import React, { useState, useEffect, createRef, useRef } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButtons,
  IonBackButton,
  IonTextarea,
  IonFooter,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonAvatar,
  IonList,
  IonAlert,
} from "@ionic/react";

import { withRouter } from "react-router";

import "./ConversationPage.css";

import {
  chevronUpCircle,
  chevronForwardOutline,
  chevronBackOutline,
} from "ionicons/icons";

import useGlobal from "../../state";

import Message from "../../components/MessageCard";
import NotificationCard from "../../components/NotificationCard";
import SmallNotification from "../../components/SmallNotificationCard";

import BackButton from "../../components/BackButton";
import Loader from "../../components/Loader";

import * as db from "../../db";
import { fs } from "../../firebase";

import { buildPath, states, triggers, types } from "../../scheme";
import { arrayWithId } from "../../utils";

const Alerts = ({
  conversationId,
  cancelAlert,
  declineAlert,
  acceptAlert,
  onDismiss,
  userId,
}) => {
  const cancelHeaderText = cancelAlert.isThisUser
    ? "Jesi li siguran da želiš odustati od usluge?"
    : "Jesi li siguran da želiš odbaciti pomoć?";
  const cancelText = cancelAlert.isThisUser ? "" : "";

  const acceptHeaderText = "Želiš li prihvatiti pomoć?";
  const acceptText = "";

  return (
    <>
      <IonAlert
        isOpen={cancelAlert.show}
        onDidDismiss={onDismiss}
        header={cancelHeaderText}
        message={cancelText}
        buttons={[
          {
            text: "Ne",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {},
          },
          {
            text: "Da",
            handler: async () => {
              const message = cancelAlert.message;
              // Delete notification message
              await db.deleteMessage(conversationId, message.id);
              // Set favor state from pending to free
              await db.setFavorState(message.favorId, states.favor.free);
              // Mark notification message as activated
              await db.updateMessage(conversationId, message.id, {
                action: true,
              });
              // Send small notification as a result of action
              await db.storeMessage(
                conversationId,
                {
                  senderId: userId,
                  favorId: message.favorId,
                  trigger: triggers.abort,
                },
                types.message.smallNotification
              );
            },
          },
        ]}
      />
      <IonAlert
        isOpen={declineAlert.show}
        onDidDismiss={onDismiss}
        header="Jesi li siguran da želiš odbaciti pomoć?"
        message=""
        buttons={[
          {
            text: "Ne",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {},
          },
          {
            text: "Da",
            handler: async () => {
              const message = declineAlert.message;
              // Set favor state from pending to free
              await db.setFavorState(message.favorId, states.favor.free);
              await db.updateMessage(conversationId, message.id, {
                action: true,
              });
              await db.storeMessage(
                conversationId,
                {
                  senderId: userId,
                  favorId: message.favorId,
                  trigger: triggers.decline,
                },
                types.message.smallNotification
              );
            },
          },
        ]}
      />
      <IonAlert
        isOpen={acceptAlert.show}
        onDidDismiss={onDismiss}
        header={acceptHeaderText}
        message={acceptText}
        buttons={[
          {
            text: "Ne",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {},
          },
          {
            text: "Prihvati",
            handler: async () => {
              const message = acceptAlert.message;
              // Set favor state from pending to active
              await db.setFavorState(message.favorId, states.favor.active);
              await db.updateMessage(conversationId, message.id, {
                action: true,
              });
              await db.storeMessage(
                conversationId,
                {
                  senderId: userId,
                  favorId: message.favorId,
                  trigger: triggers.accept,
                },
                types.message.smallNotification
              );
            },
          },
        ]}
      />
    </>
  );
};

const messageOrder = (messages, id, idprev) => {
  if (
    messages[idprev] != null &&
    messages[idprev].senderId === messages[id].senderId
  )
    return "next";
};

/*

0 - does not display anything
1 - displays time
2 - displays date and time

(it is not handling years (yet^^))

 */
const showTime = (messages, id) => {
  var idPrev = id - 1;
  if (messages[idPrev] != null) {
    var currentMessage = new Date(messages[id].dateCreated);
    var prevMessage = new Date(messages[idPrev].dateCreated);

    if (
      currentMessage.getDate() == prevMessage.getDate() &&
      currentMessage.getMonth() == prevMessage.getMonth()
    ) {
      var diff =
        currentMessage.getHours() * 60 +
        currentMessage.getMinutes() -
        (prevMessage.getHours() * 60 + prevMessage.getMinutes());
      if (diff > 60) return 1;
      else return 0;
    } else return 2;
  } else return 2;
};

const ConversationPage = (props) => {
  const [globalState, globalActions] = useGlobal();
  let messageListRef = useRef();
  let [messages, setMessages] = useState([]);
  let [messageText, setMessageText] = useState("");
  let [receiverUser, setReceiverUser] = useState({});
  let [cancelAlert, setCancelAlert] = useState({
    show: false,
    message: {},
    isThisUser: null,
  });
  let [declineAlert, setDeclineAlert] = useState({
    show: false,
    message: {},
    isThisUser: null,
  });
  let [acceptAlert, setAcceptAlert] = useState({
    show: false,
    message: {},
    isThisUser: null,
  });

  let conversationId = props.match.params.conversationId;
  let userId = globalState.userId;

  function updateConversation() {
    return fs
      .collection(
        db.buildPath(db.paths.message, {
          conversationId: conversationId,
          messageId: "",
        })
      )
      .orderBy("dateCreated", "asc")
      .onSnapshot((querySnapshot) => {
        let array = arrayWithId(querySnapshot);
        setMessages(array);
        if (array.length === 0) {
          props.history.replace("/messages");
        }
        scrollToBottom();
      });
  }

  useEffect(() => {
    const runAsync = async () => {
      // Get data from other user
      let conversation = await db.getUserConversation(userId, conversationId);
      let user = await db.getUser(conversation.receiverId);
      setReceiverUser(user);
    };

    runAsync();

    let unsubscribe = updateConversation();

    // Remove listener when page is not active anymore
    return () => unsubscribe();
  }, []);

  // Store message
  function handleTextarea() {
    if (messageText !== "") {
      db.storeMessage(conversationId, {
        senderId: userId,
        content: messageText,
      }).then(() => {
        setMessageText("");
      });
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messageListRef.current && messageListRef.current.scrollToBottom(500);
    }, 250);
  };

  const handleAlertDismiss = () => {
    if (cancelAlert.show) setCancelAlert({ show: false });
    if (declineAlert.show) setDeclineAlert({ show: false });
    if (acceptAlert.show) setAcceptAlert({ show: false });
  };

  let { id, name, pictureLink } = receiverUser;

  return (
    <IonPage>
      <Loader data={messages}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <BackButton />
            </IonButtons>
            <IonTitle>{name}</IonTitle>
            <IonButtons slot="end">
              <IonButton slot="end" routerLink={`/user/${id}`}>
                <IonAvatar className="messages-avatar">
                  <img src={pictureLink} alt="Profile" />
                </IonAvatar>
                <IonIcon
                  className="button-profile"
                  icon={chevronForwardOutline}
                />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent ref={messageListRef}>
          <Alerts
            conversationId={conversationId}
            cancelAlert={cancelAlert}
            declineAlert={declineAlert}
            acceptAlert={acceptAlert}
            onDismiss={handleAlertDismiss}
            userId={userId}
          />
          <IonList>
            {messages.map((message, id) =>
              message.type === "notification" ? (
                <NotificationCard
                  key={id}
                  user={receiverUser}
                  isThisUser={message.senderId === userId ? true : false}
                  favorId={message.favorId}
                  action={message.action}
                  showTime={showTime(messages, id)}
                  time={new Date(messages[id].dateCreated)}
                  onUserCancel={() =>
                    setCancelAlert({
                      show: true,
                      message,
                      isThisUser: message.senderId === userId,
                    })
                  }
                  onUserDecline={() =>
                    setDeclineAlert({
                      show: true,
                      message,
                      isThisUser: message.senderId === userId,
                    })
                  }
                  onUserAccept={() =>
                    setAcceptAlert({
                      show: true,
                      message,
                      isThisUser: message.senderId === userId,
                    })
                  }
                />
              ) : message.type === "smallNotification" ? (
                <SmallNotification
                  key={id}
                  user={receiverUser}
                  isThisUser={message.senderId === userId ? true : false}
                  favorId={message.favorId}
                  action={message.action}
                  showTime={showTime(messages, id)}
                  time={new Date(messages[id].dateCreated)}
                />
              ) : (
                <Message
                  key={id}
                  user={message.senderId === userId ? "right" : "left"}
                  order={messageOrder(messages, id, id - 1)}
                  showTime={showTime(messages, id)}
                  time={new Date(messages[id].dateCreated)}
                  content={message.content}
                />
              )
            )}
          </IonList>
        </IonContent>

        <IonFooter className="ion-no-border">
          <IonToolbar>
            <IonRow className="ion-align-items-center">
              <IonCol size="10">
                <IonTextarea
                  inputMode={"text"}
                  value={messageText}
                  onIonChange={(e) => setMessageText(e.target.value.trim())}
                  spellCheck={false}
                  placeholder="Unesite poruku..."
                  className="message-input"
                  rows="1"
                  onClick={scrollToBottom}
                />
              </IonCol>
              <IonCol size="2">
                <IonButton
                  onClick={handleTextarea}
                  expand="block"
                  fill="clear"
                  color="primary"
                  className="message-button"
                >
                  <IonIcon className="sendIcon" icon={chevronUpCircle} />
                </IonButton>
              </IonCol>
            </IonRow>
          </IonToolbar>
        </IonFooter>
      </Loader>
    </IonPage>
  );
};

export default withRouter(ConversationPage);
