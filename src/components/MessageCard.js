import React from "react";

import { IonRow } from "@ionic/react";

import Time from "./TimeCard";

const MessageCard = ({ user, order, content, showTime, time }) => {
  return (
    <IonRow>
      <Time showTime={showTime} time={time} />
      <div className="wrapper">
        <div className={user + " message " + order}>{content}</div>
      </div>
    </IonRow>
  );
};

export default MessageCard;
