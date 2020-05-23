import React from "react";

import { IonRow } from "@ionic/react";
import Time from "./TimeCard";

const MessageCard = ({ user, order, content, showTimeCard, time }) => {
  return (
    <IonRow>
      <Time show={showTimeCard} time={time} />
      <div className="wrapper">
        <div className={user + " message " + order}>{content}</div>
      </div>
    </IonRow>
  );
};

export default MessageCard;
