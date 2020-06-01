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

import * as db from "../../db";
import useCache from "../../hooks/useCache";

const NotificationCard = ({
  user,
  message,
  isThisUser,
  showTime,
  onUserAbort,
  onUserDecline,
  onUserAccept,
  onClick,
}) => {
  let { favorId, action, dateCreated } = message;
  let favor = useCache(() => db.getFavor(favorId), `/favor/${favorId}`, true);

  let { title, description } = favor || {};

  const buttons = () => {
    if (!action) {
      if (isThisUser) {
        return (
          <IonRow className="notification-card-buttons">
            <IonCol>
              <IonButton
                color="danger"
                expand="block"
                fill="outline"
                onClick={onUserAbort}
              >
                Poništi
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
                onClick={onUserDecline}
              >
                Odbij
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                color="primary"
                expand="block"
                fill="solid"
                onClick={onUserAccept}
              >
                Prihvati
              </IonButton>
            </IonCol>
          </IonRow>
        );
    }
  };

  return (
    <div>
      <Time show={showTime} time={dateCreated} />
      <IonCard>
        <IonCardHeader onClick={onClick}>
          <IonCardSubtitle>
            {user.name}
            {isThisUser ? " mora prihvatiti tvoju pomoć." : " ti može pomoći!"}
          </IonCardSubtitle>
          <IonCardTitle>{title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {description}
          {buttons()}
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default NotificationCard;
