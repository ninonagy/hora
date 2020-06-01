import React from "react";

import { IonRow } from "@ionic/react";
import Time from "./TimeCard";

const MessageCard = ({ direction, order, showTime, message }) => {
  return (
    <IonRow>
      <Time show={showTime} time={message.dateCreated} />
      <div className="wrapper">
        <div className={direction + " message " + order}>{message.content}</div>
      </div>
    </IonRow>
  );
};

export default MessageCard;
