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
import useCache from "../hooks/useCache";

const FavorCard = ({ skillList, item, link }) => {
  let { ownerId, title, description, skills } = item;
  // get user name, profile picture, rating
  let user = useCache(() => db.getUser(ownerId), `/user/${ownerId}`);

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

        {skills.map((skill) => (
          <IonChip>
            <IonLabel>{skillList[skill]}</IonLabel>
          </IonChip>
        ))}
      </IonCardContent>
    </IonCard>
  );
};

export default FavorCard;
