import React from 'react';
import {
  IonText,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage
} from '@ionic/react';
import { withRouter } from 'react-router';

const ProfilePage = props => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>--Name Surname--</IonTitle>
        </IonToolbar>
      </IonHeader>
      <Ion-Content></Ion-Content>
    </IonPage>
  );
};

export default withRouter(ProfilePage);
