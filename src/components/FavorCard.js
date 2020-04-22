import React from 'react';

import {
  IonIcon,
  IonText,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCard,
  IonAvatar,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonChip
} from '@ionic/react';

import { starOutline, star, starHalf } from 'ionicons/icons';

const FavorCard = ({ id, link }) => {
  return (
    <IonCard routerLink={link}>
      <IonItem>
        <IonAvatar slot="start">
          <img src="https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340" />
        </IonAvatar>
        <IonLabel>John Malkovich</IonLabel>
        <IonBadge color="warning">
          <IonIcon icon={star} />
          <IonIcon icon={star} />
          <IonIcon icon={star} />
          <IonIcon icon={starHalf} />
          <IonIcon icon={starOutline} />
        </IonBadge>
      </IonItem>

      <IonCardHeader>
        <IonCardTitle>--Title of the Favor--</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tristique pharetra tellus, vitae dignissim ex posuere eget. Etiam blandit consequat bibendum. Pellentes...
        <br />
        <IonChip>
          <IonLabel>tag1</IonLabel>
        </IonChip>
        <IonChip>
          <IonLabel>tag2</IonLabel>
        </IonChip>
      </IonCardContent>
    </IonCard>
  );
};

export default FavorCard;
