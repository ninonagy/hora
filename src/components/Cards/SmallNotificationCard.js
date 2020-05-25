import React, { useState, useEffect } from "react";

import { IonRow, IonGrid } from "@ionic/react";

import Time from "./TimeCard";

import * as db from "../../db";
import { triggers } from "../../scheme";

const SmallNotificationCard = ({
  user,
  isThisUser,
  favorId,
  showTimeCard,
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
    if (trigger == triggers.accept) {
      if (isThisUser) return "Prihvatio si pomoć";
      else return user.name + " je prihvatio pomoć";
    } else if (trigger == triggers.decline) {
      if (isThisUser) return "Odbio si pomoć";
      else return user.name + " je odbio pomoć";
    } else if (trigger == triggers.review) {
      // TODO: Add notification text
    } else if (trigger == triggers.done) {
      if (isThisUser) return "Označio si da je usluga gotova";
      else return user.name + " je označio da je usluga gotova";
    } else if (trigger == triggers.abort) {
      if (isThisUser) return "Otkazao si uslugu.";
      else return user.name + " je otkazao uslugu.";
    }
  }

  let { title, state } = favor || {};

  return (
    <div>
      <Time show={showTimeCard} time={time} />

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
