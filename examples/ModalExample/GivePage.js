import React, { useState }  from 'react';
import {
  IonText,
  IonContent,
  IonHeader,
  IonToolbar,
  IonPage,
  IonTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonItemDivider,
  IonTextarea,
  IonButton,
  IonButtons,
  IonIcon
} from '@ionic/react';

import { withRouter } from 'react-router';

const GivePage = props => {

  const [showModal, setShowModal] = useState(false);

  return (
    <IonPage>
      <IonContent>
        <IonItem>
          <IonLabel position="floating">Title</IonLabel>
          <IonInput></IonInput>
        </IonItem>
        
        <IonItem>
          <IonLabel position="floating">Description</IonLabel>
          <IonTextarea ></IonTextarea>
        </IonItem>
        
        <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>

        </IonContent>
    </IonPage>
  );
};

export default withRouter(GivePage);
