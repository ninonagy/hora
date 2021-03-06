import React from "react";

import { IonBadge } from "@ionic/react";

const RatingIcons = ({ timeEarned, timeSpent }) => {
  //let count = Math.floor(rating);
  //let decimal = rating - count;

  function returnRating(timeEarned, timeSpent) {
    if (timeEarned != null && timeSpent != null) {
      let rating = timeEarned + timeSpent;
      if (rating > 12) return "MVP";
      else if (rating > 7) return "Napredni";
      else return "Početnik";
    }
  }

  function returnColor(timeEarned, timeSpent) {
    if (timeEarned != null && timeSpent != null) {
      let rating = timeEarned + timeSpent;
      if (rating > 12) return "success";
      else if (rating > 7) return "secondary";
      else return "medium";
    }
  }

  return (
    <IonBadge color={returnColor(timeEarned, timeSpent)}>
      {returnRating(timeEarned, timeSpent)}
    </IonBadge>

    /*

    We planed on using stars - based rating system,
    but we didn't have enough time to implement it.

    <IonBadge color="warning">
        {[...Array(5)].map((e, i) =>
          i < count ? (
            <IonIcon icon={star} />
          ) : i === count && decimal >= 0.5 ? (
            <IonIcon icon={starHalf} />
          ) : (
            <IonIcon icon={starOutline} />
          )
        )}
    </IonBadge>
    */
  );
};

export default RatingIcons;
