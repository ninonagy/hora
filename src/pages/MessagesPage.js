import React from 'react';
import { IonText, IonContent, IonHeader, IonToolbar, IonTitle, IonPage } from '@ionic/react';
import { withRouter } from "react-router";

const MessagesPage = props => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Messages</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      </IonContent>
    </IonPage>
  );
}

export default withRouter(MessagesPage);