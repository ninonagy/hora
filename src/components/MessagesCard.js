import React from 'react';

import {
  IonLabel,
  IonItem,
  IonAvatar,
  IonBadge
} from '@ionic/react';

import { starOutline, star, starHalf } from 'ionicons/icons';

const MessagesCard = ({ }) => {
  return (
    <IonItem>
      <IonAvatar slot="start">
        <img src="https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340" />
      </IonAvatar>
      <IonLabel>
        <h2>Josh</h2>
        <p>Lorem ipsum...</p>
      </IonLabel>
      <IonBadge color="danger">55</IonBadge>
    </IonItem>
  );
};

export default MessagesCard;
