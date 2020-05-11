import React, { useState, useEffect } from "react";

import { IonLabel, IonItem, IonAvatar } from "@ionic/react";

import * as db from "../db";

const MessagesCard = ({ link, userId }) => {
  let [user, setUser] = useState({});

  useEffect(() => {
    db.getUser(userId).then((user) => {
      setUser(user);
    });
  }, []);

  let { name, pictureLink } = user;

  return (
    <IonItem routerLink={link}>
      <IonAvatar slot="start">
        <img src={pictureLink} alt="User" />
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
