import React from 'react';
import { IonText, IonContent, IonHeader, IonToolbar, IonTitle, IonPage } from '@ionic/react';
import { withRouter } from "react-router";

const Addpage = props => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Give</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      </IonContent>
    </IonPage>
  );
}

export default withRouter(GivePage);