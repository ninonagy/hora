import React from "react";

import { IonRow } from "@ionic/react";

const MessageCard = ({ user, order, content }) => {
  return (
    <IonRow>
      <div className="wrapper">
        <div className={user + " message " + order}>{content}</div>
      </div>
    </IonRow>
  );
};

export default MessageCard;
