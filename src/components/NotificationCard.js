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
  IonIcon,
} from "@ionic/react";

import { withRouter } from "react-router";

import Time from "./TimeCard";

import * as db from "../db";

const NotificationCard = ({
  history,
  action,
  user,
  isThisUser,
  favorId,
  onUserCancel,
  onUserDecline,
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
    if (!action) {
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
      <Time showTime={showTime} time={time} />
      <IonCard onClick={(e) => history.push(`/favor/${favorId}`)}>
        <IonCardHeader>
          <IonCardSubtitle>
            {userName}
            {isThisUser ? " mora prihvatiti tvoju pomoć." : " ti može pomoći!"}
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

export default withRouter(NotificationCard);
