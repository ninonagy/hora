import React from 'react';
import { IonText, IonContent, IonHeader, IonToolbar, IonTitle, IonPage } from '@ionic/react';
import { withRouter } from "react-router";

const FindPage = props => {
  return (
    <IonPage>
      <IonContent fullscreen="true">
        <IonToolbar>
          <IonTitle slot="start">
            HORA
        </IonTitle>
        </IonToolbar>
      </IonContent>
    </IonPage>
  );
}

export default withRouter(FindPage);