import React, { useState, useEffect } from "react";

import { IonRow, IonGrid } from "@ionic/react";

import { withRouter } from "react-router";

import Time from "./TimeCard";

import * as db from "../../db";
import { triggers } from "../../scheme";

const SmallNotificationCard = ({
  history,
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
      if (!isThisUser)
        return (
          user.name +
          " je označio da je usluga zavšena. Sada možeš ocjeniti " +
          user.name +
          "."
        );
    } else if (trigger == triggers.done) {
      if (isThisUser) return "Označio si da je usluga gotova";
      else return user.name + " je označio da je usluga gotova";
    } else if (trigger == triggers.abort) {
      if (isThisUser) return "Otkazao si uslugu.";
      else return user.name + " je otkazao uslugu.";
    }
  }

  function returnTitle(isThisUser, trigger, title) {
    if (trigger != triggers.review) {
      return title;
    } else if (!isThisUser) return title;
  }

  let { title, state } = favor || {};

  return (
    <div>
      <Time show={showTimeCard} time={time} />

      <IonGrid onClick={(e) => history.push(`/favor/${favorId}`)}>
        <IonRow className="ion-justify-content-center date">
          {returnNotificationtext(user, isThisUser, trigger)}
        </IonRow>
        <IonRow className="ion-justify-content-center hour">
          {returnTitle(isThisUser, trigger, title)}
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default withRouter(SmallNotificationCard);
