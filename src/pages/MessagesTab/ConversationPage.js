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
        <div class="message left">
          They're not aliens, they're Earth…liens! You've swallowed a planet!
        </div>
        <div class="message left next">
          Saving the world with meals on wheels.
        </div>
        <div class="message right">
          You've swallowed a planet! I hate yogurt. It's just stuff with bits
          in. Annihilate?.
        </div>
        <div class="message right next">
          The way I see it, every life is a pile of good things and bad things
        </div>
        <div class="message right next">
          The good things don't always soften the bad things, but vice-versa the
          bad things don't necessarily spoil the good things and make them
          unimportant...
        </div>
        <div class="message left">
          No. No violence. I won't stand for it. Not now, not ever, do you
          understand me?!
        </div>
        <div class="message right">
          No… It's a thing; it's like a plan, but with more greatness. It's art!
          A statement on modern society, 'Oh Ain't Modern Society Awful?'!
        </div>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(ConversationPage);
