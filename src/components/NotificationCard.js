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

const NotificationCard = ({ user, order, content }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardSubtitle>user.username can do you a favor!</IonCardSubtitle>
        <IonCardTitle>Zamjeniti žarulju u kući</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {content}
        <IonRow className="notification-card-buttons">
          <IonCol>
            <IonButton color="danger" expand="block" fill="outline">
              Odbij
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton color="primary" expand="block" fill="solid">
              Prihvati
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  );
};

export default NotificationCard;
