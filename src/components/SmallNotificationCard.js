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
  trigger,
}) => {
  let [favor, setFavor] = useState({});

  useEffect(() => {
    db.getFavor(favorId).then((favor) => {
      setFavor(favor);
    });
  }, []);

  function returnNotificationtext(user, isThisUser, trigger) {
    if (trigger == "accept") {
      if (isThisUser) return "Prihvatio si pomoć";
      else return user.name + " je prihvatio pomoć";
    } else if (trigger == "decline") {
      if (isThisUser) return "Odbio si pomoć";
      else return user.name + " je odbio pomoć";
    } else if (trigger == "done") {
      if (isThisUser) return "Označio si da je usluga gotova";
      else return user.name + " je označio da je usluga gotova";
    } else if (trigger == "abort") {
      if (isThisUser) return "Otkazao si uslugu.";
      else return user.name + " je otkazao uslugu. Usluga je ponovno slobodna.";
    }
  }

  let { title, state } = favor || {};

  return (
    <div>
      <Time showTime={showTime} time={time} />

      <IonGrid>
        <IonRow className="ion-justify-content-center date">
          {returnNotificationtext(user, isThisUser, trigger)}
        </IonRow>
        <IonRow className="ion-justify-content-center hour">{title}</IonRow>
      </IonGrid>
    </div>
  );
};

export default SmallNotificationCard;
