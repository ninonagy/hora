import React from "react";

import { IonLabel, IonItem, IonAvatar, IonImg } from "@ionic/react";

import * as db from "../../db";
import useCache from "../../hooks/useCache";
import { showDate } from "../../utils";

const MessagesCard = ({ link, item }) => {
  let { receiverId, seen, updatedAt } = item;

  let time = showDate(new Date(updatedAt));

  let user = useCache(() => db.getUser(receiverId), `/user/${receiverId}`);
  let { name, pictureLink } = user;

  return (
    <IonItem routerLink={link}>
      <IonAvatar slot="start">
        <IonImg src={pictureLink} />
      </IonAvatar>
      <IonLabel>
        <h2>{seen ? name : <strong>{name}</strong>} </h2>
        {/* <p>Lorem ipsum...</p> */}
      </IonLabel>
      {time}
    </IonItem>
  );
};

export default MessagesCard;
