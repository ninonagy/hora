import React, { useState, useEffect } from "react";

import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonRow,
  IonCol,
  IonButton,
} from "@ionic/react";

import Time from "./TimeCard";

import * as db from "../db";

const NotificationCard = ({
  user,
  isThisUser,
  favorId,
  onUserCancel,
  onUserAccept,
  showTime,
  time,
}) => {
  let [favor, setFavor] = useState({});

  let userName = user.name;

  useEffect(() => {
    db.getFavor(favorId).then((favor) => {
      setFavor(favor);
    });
  }, []);

  let { title, description } = favor || {};

  const buttons = () => {
    if (isThisUser) {
      return (
        <IonRow className="notification-card-buttons">
          <IonCol>
            <IonButton
              color="danger"
              expand="block"
              fill="outline"
              onClick={onUserCancel}
            >
              Cancel
            </IonButton>
          </IonCol>
        </IonRow>
      );
    } else
      return (
        <IonRow className="notification-card-buttons">
          <IonCol>
            <IonButton
              color="danger"
              expand="block"
              fill="outline"
              onClick={onUserCancel}
            >
              Decline
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              color="primary"
              expand="block"
              fill="solid"
              onClick={onUserAccept}
            >
              Accept
            </IonButton>
          </IonCol>
        </IonRow>
      );
  };

  return (
    <div>
      <Time showTime={showTime} time={time} />
      <IonCard>
        <IonCardHeader>
          <IonCardSubtitle>
            {userName}
            {isThisUser ? " has to accept your favor." : " can do you a favor!"}
          </IonCardSubtitle>
          <IonCardTitle>{title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {description} {buttons()}
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default NotificationCard;
