import React, { useState, useEffect } from "react";
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
} from "@ionic/react";

import { withRouter } from "react-router";

import "./ConversationPage.css";

import Message from "../../components/MessageCard";

import { chevronUpCircle, chevronForwardOutline, chevronBackOutline } from "ionicons/icons";
import NotificationCard from "../../components/NotificationCard";
import useGlobal from "../../state";

import BackButton from "../../components/BackButton";
import Loader from "../../components/Loader";

import * as db from "../../db";
import { fs } from "../../firebase";

const ConversationPage = (props) => {
  const [globalState, globalActions] = useGlobal();
  let [messages, setMessages] = useState([]);
  let [messageText, setMessageText] = useState("");
  let [receiverUser, setReceiverUser] = useState({});

  let conversationId = props.match.params.conversationId;
  let userId = globalState.userId;

  function updateConversation() {
    fs.collection(
      db.buildPath(db.paths.message, {
        conversationId: conversationId,
        messageId: "",
      })
    )
      .orderBy("dateCreated", "asc")
      .onSnapshot((querySnapshot) => {
        let array = [];
        querySnapshot.forEach((doc) => {
          array.push({ ...doc.data(), id: doc.id });
        });
        setMessages(array);
      });
  }

  useEffect(() => {
    updateConversation();
    // Get data from other user
    db.getUserConversation(userId, conversationId).then((conversation) => {
      db.getUser(conversation.receiverId).then((user) => {
        setReceiverUser(user);
      });
    });
  }, []);

  const messageOrder = (messages, id, idprev) => {
    if (
      messages[idprev] != null &&
      messages[idprev].senderId === messages[id].senderId
    )
      return "next";
  };

  // Store message
  function handleTextarea() {
    if (messageText !== "") {
      db.storeMessage(conversationId, {
        senderId: userId,
        content: messageText,
      }).then(() => {
        setMessageText("");
        // Temporary solution
        // Download again all messages, including newly created message
        updateConversation();
      });
    }
  }

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

        <IonContent>
          <IonList>
            {messages.map((message, id) =>
              message.type === "notification" ? (
                <NotificationCard
                  key={id}
                  user={receiverUser}
                  isThisUser={message.senderId === userId ? true : false}
                  favorId={message.favorId}
                />
              ) : (
                <Message
                  key={id}
                  user={message.senderId === userId ? "right" : "left"}
                  order={messageOrder(messages, id, id - 1)}
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
