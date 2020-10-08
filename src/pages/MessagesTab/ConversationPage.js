import React, { useEffect, useRef } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButtons,
  IonTextarea,
  IonFooter,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonAvatar,
} from "@ionic/react";

import { withRouter } from "react-router";

import "./ConversationPage.css";

import { chevronUpCircle, chevronForwardOutline } from "ionicons/icons";

import BackButton from "../../components/Buttons/Back";
import Loader from "../../components/shared/Loader";
import MessagesList from "./MessagesList";
import AlertModal from "./AlertModal";

import * as db from "../../db";
import { fs } from "../../firebase";
import useGlobal from "../../state";
import { useStore } from "./model";
import { arrayWithId } from "../../utils";

const ConversationPage = (props) => {
  const [globalState] = useGlobal();
  let [state, actions] = useStore("Conversation");
  let messageListRef = useRef();

  let userId = globalState.userId;
  let conversationId = props.match.params.conversationId;

  useEffect(() => {
    let unsubscribe;

    db.getMessages(conversationId, "cache").then(async (messages) => {
      actions.setMessages(messages);
      unsubscribe = listenConversationUpdate();
    });

    const listenConversationUpdate = () => {
      return fs
        .collection(
          db.buildPath(db.paths.message, {
            conversationId: conversationId,
            messageId: "",
          })
        )
        .where("dateCreated", ">", state.lastMessageDateCreated)
        .orderBy("dateCreated", "asc")
        .onSnapshot((querySnapshot) => {
          if (querySnapshot.metadata.fromCache === false) {
            actions.setMessages(arrayWithId(querySnapshot));
          }
          scrollToBottom();
        });
    };

    actions.setUsers({
      senderId: userId,
      conversationId,
    });

    // Remove listener and clear messages when page is not active
    return () => {
      unsubscribe();
      actions.clearState();
    };
  }, []);

  async function handleInput() {
    if (state.messageTextInput !== "") {
      await db.storeMessage(conversationId, {
        senderId: userId,
        content: state.messageTextInput,
      });
      actions.clearMessageTextInput();
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messageListRef.current && messageListRef.current.scrollToBottom(500);
    }, 400);
  };

  let { id, name, pictureLink } = state.receiverUser || {};

  return (
    <IonPage>
      <Loader data={state.messages}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <BackButton
                link={`/messages`}
                onBack={actions.markConversationAsSeen}
              />
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
          <AlertModal />
          {state.receiverUser && <MessagesList messages={state.messages} />}
        </IonContent>

        <IonFooter className="ion-no-border">
          <IonToolbar>
            <IonRow className="ion-align-items-center">
              <IonCol size="10">
                <IonTextarea
                  inputMode={"text"}
                  value={state.messageTextInput}
                  onIonChange={(e) =>
                    actions.setMessageTextInput(e.target.value)
                  }
                  spellCheck={false}
                  placeholder="Unesite poruku..."
                  className="message-input"
                  rows="1"
                  onClick={scrollToBottom}
                />
              </IonCol>
              <IonCol size="2">
                <IonButton
                  onClick={handleInput}
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
