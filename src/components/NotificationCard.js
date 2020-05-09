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

import * as db from "../db";

const NotificationCard = ({ user, user_is_me, content }) => {
  let [favor, setFavor] = useState({});

  useEffect(() => {
    db.getFavor(content).then((favor) => {
      setFavor(favor);
    });
  }, []);

  let { title, description } = favor || {};

  const buttons = () => {
    if (user_is_me) {
      return (
        <IonRow className="notification-card-buttons">
          <IonCol>
            <IonButton color="danger" expand="block" fill="outline">
              Cancel
            </IonButton>
          </IonCol>
        </IonRow>
      );
    } else
      return (
        <IonRow className="notification-card-buttons">
          <IonCol>
            <IonButton color="danger" expand="block" fill="outline">
              Decline
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton color="primary" expand="block" fill="solid">
              Accept
            </IonButton>
          </IonCol>
        </IonRow>
      );
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardSubtitle>
          {user}
          {user_is_me ? " has to accept your favor." : " can do you a favor!"}
        </IonCardSubtitle>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {description} {buttons()}
      </IonCardContent>
    </IonCard>
  );
};

export default NotificationCard;
