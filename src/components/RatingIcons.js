import React from "react";

import { IonIcon, IonBadge } from "@ionic/react";

import { starOutline, star, starHalf } from "ionicons/icons";

const RatingIcons = ({ rating }) => {
  let count = Math.floor(rating);
  let decimal = rating - count;

  return (
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
  );
};

export default RatingIcons;
