import React, { useState, useEffect } from "react";

import { IonRow, IonGrid } from "@ionic/react";

import Time from "./TimeCard";

import * as db from "../db";

const SmallNotificationCard = ({
  user,
  isThisUser,
  favorId,
  showTime,
  time,
}) => {
  let [favor, setFavor] = useState({});

  useEffect(() => {
    db.getFavor(favorId).then((favor) => {
      setFavor(favor);
    });
  }, []);

  function returnFavorStatus(favor) {
    if (favor.state == "free") return " declined";
    if (favor.state == "active") return " accepted";
  }

  function returnUserName(user, isThisUser) {
    if (isThisUser) return "You";
    else return user.name;
  }

  let { title, state } = favor || {};

  return (
    <div>
      <Time showTime={showTime} time={time} />

      <IonGrid>
        <IonRow className="ion-justify-content-center date">
          {returnUserName(user, isThisUser)}
          {returnFavorStatus(favor)}
          {isThisUser ? " the help." : " your help!"}
        </IonRow>
        <IonRow className="ion-justify-content-center hour">{title}</IonRow>
      </IonGrid>
    </div>
  );
};

export default SmallNotificationCard;
