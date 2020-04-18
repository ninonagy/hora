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
        <ion-item>
          <ion-avatar slot="start">
            <img src="https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340" />
          </ion-avatar>
          <ion-label>John Malkovich</ion-label>
          <ion-badge color="danger">55</ion-badge>
        </ion-item>

        <ion-item>
          <ion-avatar slot="start">
            <img src="https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340" />
          </ion-avatar>
          <ion-label>John Malkovich</ion-label>
          <ion-badge color="danger">55</ion-badge>
        </ion-item>        
      </IonContent>
    </IonPage>
  );
}

export default withRouter(MessagesPage);