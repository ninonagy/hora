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

  let { name } = user;

  return (
    <IonItem routerLink={link}>
      <IonAvatar slot="start">
        <img src="https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340" />
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
