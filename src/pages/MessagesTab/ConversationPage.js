import React, { useState, useEffect } from "react";
import {
  IonText,
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
} from "@ionic/react";

import { withRouter } from "react-router";

import "./ConversationPage.css";

import Message from "../../components/MessageCard";

import { chevronUpCircle, chevronForwardOutline } from "ionicons/icons";
import NotificationCard from "../../components/NotificationCard";
import useGlobal from "../../state";

import * as db from "../../db";

const ConversationPage = (props) => {
  const [globalState, globalActions] = useGlobal();
  let [messages, setMessages] = useState([]);

  let conversationId = props.match.params.conversationId;
  let userId = globalState.userId;

  useEffect(() => {
    db.getConversation(conversationId).then((messages) => {
      setMessages(messages);
    });
  }, []);

  const messageOrder = (messages, id, idprev) => {
    if (
      messages[idprev] != null &&
      messages[idprev].senderId === messages[id].senderId
    )
      return "next";
  };

  if (messages.length) {
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" />
          </IonButtons>
          <IonTitle>user.username</IonTitle>
          <IonButtons slot="end">
            <IonButton slot="end" routerLink={`/user/${userId}`}>
              <IonAvatar class="messages-avatar">
                <img src="http://placekitten.com/50/50" alt="Profile" />
              </IonAvatar>
              <IonIcon class="button-profile" icon={chevronForwardOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {messages.map((message, id) =>
          message.type === "notification" ? (
            <NotificationCard
              user={message.senderId === userId ? "right" : "left"}
              content={message.content}
            />
          ) : (
            <Message
              user={message.senderId === userId ? "right" : "left"}
              order={messageOrder(messages, id, id - 1)}
              content={message.content}
            />
          )
        )}
        {/* <Message
          user="left"
          order="next"
          content="Saving the world with meals on wheels."
        />
        <Message
          user="right"
          order=""
          content="You've swallowed a planet! I hate yogurt. It's just stuff with bits
          in. Annihilate?."
        />
        <Message
          user="right"
          order="next"
          content="The way I see it, every life is a pile of good things and bad things."
        />
        <Message
          user="right"
          order="next"
          content="The good things don't always soften the bad things, but vice-versa the
          bad things don't necessarily spoil the good things and make them
          unimportant..."
        />
        <Message
          user="left"
          order=""
          content="No. No violence. I won't stand for it. Not now, not ever, do you
          understand me?!"
        />

        <NotificationCard />

        <Message
          user="right"
          order=""
          content="No… It's a thing; it's like a plan, but with more greatness. It's art!
          A statement on modern society, 'Oh Ain't Modern Society Awful?'!"
        /> */}
      </IonContent>
      <IonFooter className="ion-no-border">
        <IonToolbar>
          <IonRow className="ion-align-items-center">
            <IonCol size="10">
              <IonTextarea
                placeholder="Hey! Ho! Let's go!"
                class="message-input"
                rows="1"
              ></IonTextarea>
            </IonCol>
            <IonCol size="2">
              <IonButton
                expand="block"
                fill="clear"
                color="primary"
                class="message-button"
              >
                <IonIcon class="sendIcon" icon={chevronUpCircle} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default withRouter(ConversationPage);
