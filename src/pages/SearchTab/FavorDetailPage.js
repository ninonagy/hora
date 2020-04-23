import React from 'react';
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
  IonButton
} from '@ionic/react';

import './FavorDetailPage.css';

import { withRouter } from 'react-router';

import RatingIcons from '../../components/RatingIcons';

import * as db from '../../db';

const items = [
  { src: 'http://placekitten.com/g/100/100', text: 'this is my cat Minnie' },
  { src: 'http://placekitten.com/g/101/100', text: 'this is my cat John' }
];

const getAge = birthDate =>
  new Date().getFullYear() - new Date(birthDate).getFullYear();

const FavorDetailPage = ({ match }) => {
  let favorId = match.params.id;

  let { ownerId, title, description, location, dateCreated } = db.getFavor(
    favorId
  );

  let user = db.getUser(ownerId);

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
      <IonContent>
        <IonItem>
          <IonAvatar slot="start">
            <IonImg src={user.pictureLink} />
          </IonAvatar>
          <IonLabel>
            {user.name}, {getAge(user.birthDate)}
          </IonLabel>
          <IonBadge color="warning">
            <RatingIcons rating={user.rating} />
          </IonBadge>
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
