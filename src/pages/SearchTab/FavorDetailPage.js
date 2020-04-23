import React from 'react';
import {
  IonText,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import { withRouter } from 'react-router';

import * as db from '../../db';

const FavorDetailPage = ({ match }) => {
  let favorId = match.params.id;

  let { ownerId, title, description, location, dateCreated } = db.getFavor(
    favorId
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent></IonContent>
    </IonPage>
  );
};

export default withRouter(FavorDetailPage);
