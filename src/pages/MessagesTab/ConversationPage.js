import React from "react";
import {
  IonText,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButtons,
  IonBackButton,
  IonAvatar,
  IonList,
} from "@ionic/react";

import { withRouter } from "react-router";

import "./ConversationPage.css";

import Message from "../../components/MessageCard";

const ConversationPage = (props) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" />
          </IonButtons>
          <IonTitle>Conversation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Message
          user="left"
          order=""
          content="They're not aliens, they're Earth…liens! You've swallowed a planet!"
        />
        <Message
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
        <Message
          user="right"
          order=""
          content="No… It's a thing; it's like a plan, but with more greatness. It's art!
          A statement on modern society, 'Oh Ain't Modern Society Awful?'!"
        />
      </IonContent>
    </IonPage>
  );
};

export default withRouter(ConversationPage);
