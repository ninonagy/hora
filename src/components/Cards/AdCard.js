import React from "react";

import {
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCard,
  IonItem,
  IonLabel,
  IonBadge,
} from "@ionic/react";

import "./FavorCard.css";

const FavorCard = ({ item }) => {
  let { title, description, url, company } = item;

  return (
    <IonCard className="adCard" onClick={(e) => window.open(url)}>
      <IonItem lines="full">
        <IonBadge color="warning">Oglas</IonBadge>
        <IonLabel className="ad-company">{company}</IonLabel>
      </IonItem>

      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>{description}</IonCardContent>
    </IonCard>
  );
};

export default FavorCard;
