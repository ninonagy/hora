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

import * as db from '../db';

const RatingIcons = ({ rating }) => {
  let count = Math.floor(rating);
  let decimal = rating - count;

  return (
    <IonBadge color="warning">
      {[...Array(5)].map((e, i) =>
        i < count ? (
          <IonIcon icon={star} />
        ) : i === count && decimal >= 0.5 ? (
          <IonIcon icon={starHalf} />
        ) : (
          <IonIcon icon={starOutline} />
        )
      )}
    </IonBadge>
  );
};

const FavorCard = ({ item, link }) => {
  let { ownerId, title, description } = item;

  // get user name, profile picture, rating
  let user = db.getUser(ownerId);

  return (
    <IonCard routerLink={link}>
      <IonItem>
        <IonAvatar slot="start">
          <img src={user.pictureLink} alt="Profile" />
        </IonAvatar>
        <IonLabel>{user.name}</IonLabel>
        <RatingIcons rating={user.rating} />
      </IonItem>

      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {description}
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
