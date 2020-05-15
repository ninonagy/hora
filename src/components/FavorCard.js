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

import "./FavorCard.css";

import RatingIcons from "../components/RatingIcons";

import * as db from "../db";

const FavorCard = ({ skillList, item, link }) => {
  let { ownerId, title, description, skills } = item;
  let [user, setUser] = useState({});

  useEffect(() => {
    // get user name, profile picture, rating
    db.getUser(ownerId).then((user) => setUser(user));
  }, []);

  return (
    <IonCard routerLink={link}>
      <IonItem lines="full">
        <IonAvatar slot="start" className="favorCard-avatar">
          <img src={user.pictureLink} alt="Profile" />
        </IonAvatar>
        <IonLabel>{user.name}</IonLabel>
        <RatingIcons timeEarned={user.timeEarned} timeSpent={user.timeSpent} />
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
