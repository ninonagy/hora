import React from "react";

import {
  IonIcon,
  IonText,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCard,
  IonAvatar,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonChip,
} from "@ionic/react";

import * as db from "../db";

const MessageCard = ({ user, order, content }) => {
  return <div class={user + " message " + order}>{content}</div>;
};

export default MessageCard;
