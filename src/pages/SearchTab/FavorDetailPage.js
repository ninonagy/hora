import React, { useState } from "react";
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
  IonPopover,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
} from "@ionic/react";

import "./FavorDetailPage.css";

import { withRouter } from "react-router";

import RatingIcons from "../../components/RatingIcons";

import ImageCard from "../../components/ImageCard";

import { ellipsisHorizontal } from "ionicons/icons";

import * as db from "../../db";

const items = [
  { src: "http://placekitten.com/g/100/100", text: "this is my cat Minnie" },
  { src: "http://placekitten.com/g/101/100", text: "this is my cat John" },
];

const getAge = (birthDate) =>
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
        onDidDismiss={(e) => setShowPopover({ open: false })}
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
            <IonButton
              onClick={(e) =>
                setShowPopover({ open: true, event: e.nativeEvent })
              }
            >
              <IonIcon icon={ellipsisHorizontal} />
            </IonButton>
          </IonButtons>
          <IonTitle>Favor</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol offset="1" size="3">
              <IonAvatar class="favor-avatar">
                <IonImg src={user.pictureLink} />
              </IonAvatar>
            </IonCol>
            <IonCol>
              {user.name}, {getAge(user.birthDate)}
              <br />
              <RatingIcons rating={user.rating} />
            </IonCol>
          </IonRow>
        </IonGrid>
        <div class="favor-text">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div class="image-card-wrapper">
          <ImageCard
            url="http://placekitten.com/230/520"
            caption="This is Minnie"
            orientation="portrait"
          />
          <ImageCard
            url="http://placekitten.com/421/230"
            caption="Haha! Cute Maxie!"
            orientation="landscape"
          />
          <ImageCard
            url="http://placekitten.com/250/500"
            caption="(:"
            orientation="portrait"
          />
          <ImageCard
            url="http://placekitten.com/230/230"
            caption="Ohhh look at Foxie!"
            orientation="landscape"
          />
        </div>

        <IonButton
          class="button-do-it"
          size="large"
          color="dark"
          expand="block"
        >
          HELP
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(FavorDetailPage);
