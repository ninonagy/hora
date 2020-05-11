import React, { useState, useEffect } from "react";

import {
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCard,
  IonAvatar,
  IonItem,
  IonLabel,
  IonChip,
} from "@ionic/react";

import RatingIcons from "../components/RatingIcons";

import * as db from "../db";

const FavorCard = ({ item, link }) => {
  let { ownerId, title, description } = item;
  let [user, setUser] = useState({});

  useEffect(() => {
    // get user name, profile picture, rating
    db.getUser(ownerId).then((user) => setUser(user));
  }, []);

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
