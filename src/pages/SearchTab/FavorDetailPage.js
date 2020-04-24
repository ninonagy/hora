import React, { useState } from 'react';
import {
  IonText,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButtons,
  IonBackButton,
  IonItem,
  IonAvatar,
  IonIcon,
  IonLabel,
  IonBadge,
  IonList,
  IonImg,
  IonButton,
  IonPopover
} from '@ionic/react';

import './FavorDetailPage.css';

import { withRouter } from 'react-router';

import RatingIcons from '../../components/RatingIcons';

import { ellipsisHorizontal } from 'ionicons/icons';
  
import * as db from '../../db';

const items = [
  { src: 'http://placekitten.com/g/100/100', text: 'this is my cat Minnie' },
  { src: 'http://placekitten.com/g/101/100', text: 'this is my cat John' }
];

const getAge = birthDate =>
  new Date().getFullYear() - new Date(birthDate).getFullYear();

const FavorDetailPage = ({ match }) => {
  let favorId = match.params.id;

const [showPopover, setShowPopover] = useState(false);
  
  let { ownerId, title, description, location, dateCreated } = db.getFavor(
    favorId
  );

  let user = db.getUser(ownerId);

  return (
    <IonPage>
      <IonPopover
        isOpen={showPopover.open}
        event={showPopover.event}
        onDidDismiss={e => setShowPopover({ open: false})}
      >
        <ion-list>
          <ion-item>Report</ion-item>
          <ion-item>Share</ion-item>
        </ion-list>
      </IonPopover>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={(e) => setShowPopover({ open: true, event: e.nativeEvent })}>
              <IonIcon icon={ellipsisHorizontal} />
            </IonButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonAvatar slot="start">
            <IonImg src={user.pictureLink} />
          </IonAvatar>
          <IonLabel>
            {user.name}, {getAge(user.birthDate)}
          </IonLabel>
          <RatingIcons rating={user.rating} />
        </IonItem>
        <h1>{title}</h1>
        <p>{description}</p>
        <IonList>
          {items.map((image, i) => (
            <IonItem key={i}>
              <IonImg src={image.src} />
              <IonLabel>{image.text}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonButton color="dark" expand="block">
          HELP
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(FavorDetailPage);
