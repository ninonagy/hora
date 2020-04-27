import React from "react";

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

const NotificationCard = ({ user, order, content }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardSubtitle>user.username can do you a favor!</IonCardSubtitle>
        <IonCardTitle>Zamjeniti žarulju u kući</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        Ne znam kako se minjaju žarulje. Ima koji električar da mi pomogne i
        nauči me?
        <IonRow class="notification-card-buttons">
          <IonCol>
            <IonButton color="primary" expand="block" fill="outline">
              Prihvati
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton color="danger" expand="block" fill="outline">
              Odbij
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  );
};

export default NotificationCard;
