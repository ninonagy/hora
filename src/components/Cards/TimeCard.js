import React from "react";

import { IonRow, IonGrid } from "@ionic/react";
import { showDate, showTime } from "../../utils";

const TimeCard = ({ show, time }) => {
  if (show === 2) {
    return (
      <IonGrid>
        <IonRow className="ion-justify-content-center date">
          {showDate(time)}
        </IonRow>
        <IonRow className="ion-justify-content-center hour">
          {showTime(time)}
        </IonRow>
      </IonGrid>
    );
  } else if (show === 1) {
    return (
      <IonGrid>
        <IonRow className="ion-justify-content-center hour">
          {showTime(time)}
        </IonRow>
      </IonGrid>
    );
  } else return null;
};

export default TimeCard;
