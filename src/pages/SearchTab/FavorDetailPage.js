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

import { starOutline, star, starHalf } from 'ionicons/icons';

import { withRouter } from 'react-router';

import './FavorDetailPage.css';

const items = [{ src: 'http://placekitten.com/g/100/100', text: 'this is my cat Minnie' }, { src: 'http://placekitten.com/g/101/100', text: 'this is my cat John' }];

const FavorDetailPage = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" />
          </IonButtons>
          <IonTitle>Favor</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonAvatar slot="start">
            <img src="https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340" />
          </IonAvatar>
          <IonLabel>John, 25</IonLabel>
          <IonBadge color="warning">
            <IonIcon icon={star} />
            <IonIcon icon={star} />
            <IonIcon icon={star} />
            <IonIcon icon={starHalf} />
            <IonIcon icon={starOutline} />
          </IonBadge>
        </IonItem>
        <h1>This is the title</h1>
        <p>Lorem ipsum dolor sit amet...</p>
        <IonList>
          {items.map((image, i) => (
            <IonItem key={i}>
              <IonImg src={image.src} />
              <IonLabel>{image.text}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonButton color="dark" expand="block">HELP</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(FavorDetailPage);
