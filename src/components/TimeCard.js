import React from "react";

import { IonRow, IonGrid } from "@ionic/react";
import { earthOutline } from "ionicons/icons";

const showDate = (time) => {
  var today = new Date();
  if (today.getDate() == time.getDate() && today.getMonth() == time.getMonth())
    return "Today";
  else if (
    today.getDate() - 1 == time.getDate() &&
    today.getMonth() == time.getMonth()
  )
    return "Yesterday";
  else return time.getDate() + ". " + time.getMonth() + ".";
};

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
