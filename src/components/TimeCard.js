import React from "react";

import { IonRow, IonGrid } from "@ionic/react";
import { earthOutline } from "ionicons/icons";

/*

0 - does not display anything
1 - displays time
2 - displays date and time

(it is not handling years (yet^^))

 */

var months = {
  1: "siječnja",
  2: "veljače",
  3: "ožujka",
  4: "travnja",
  5: "svibnja",
  6: "lipnja",
  7: "srpnja",
  8: "kolovoza",
  9: "rujna",
  10: "listopada",
  11: "studenog",
  12: "prosinca",
};

const showDate = (time) => {
  var today = new Date();
  if (today.getDate() == time.getDate() && today.getMonth() == time.getMonth())
    return "Danas";
  else if (
    today.getDate() - 1 == time.getDate() &&
    today.getMonth() == time.getMonth()
  )
    return "Jučer";
  else return time.getDate() + ". " + months[time.getMonth() + 1];
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
