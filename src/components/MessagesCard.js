import React, { useState, useEffect } from "react";

import { IonLabel, IonItem, IonAvatar, IonImg } from "@ionic/react";

import * as db from "../db";
import useCache from "../hooks/useCache";

const MessagesCard = ({ link, userId }) => {
  let user = useCache(() => db.getUser(userId), `/user/${userId}`);

  let { name, pictureLink } = user;

  return (
    <IonItem routerLink={link}>
      <IonAvatar slot="start">
        <IonImg src={pictureLink} />
      </IonAvatar>
      <IonLabel>
        <h2>{name}</h2>
        {/* <p>Lorem ipsum...</p> */}
      </IonLabel>
      {/* 9:41 */}
    </IonItem>
  );
};

export default MessagesCard;
