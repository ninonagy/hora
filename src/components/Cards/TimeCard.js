import React from "react";

import { IonRow, IonGrid } from "@ionic/react";
import { showDate } from "../../utils";

const TimeCard = ({ showTime, time }) => {
  if (showTime == 2) {
    return (
      <IonGrid>
        <IonRow className="ion-justify-content-center date">
          {showDate(time)}
        </IonRow>
        <IonRow className="ion-justify-content-center hour">
          {time.getHours() < 10 ? "0" : ""}
          {time.getHours()}:{time.getMinutes() < 10 ? "0" : ""}
          {time.getMinutes()}
        </IonRow>
      </IonGrid>
    );
  } else if (showTime == 1) {
    return (
      <IonGrid>
        <IonRow className="ion-justify-content-center hour">
          {time.getHours() < 10 ? "0" : ""}
          {time.getHours()}:{time.getMinutes() < 10 ? "0" : ""}
          {time.getMinutes()}
        </IonRow>
      </IonGrid>
    );
  } else return null;
};

export default TimeCard;
