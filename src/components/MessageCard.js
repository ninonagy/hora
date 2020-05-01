import React from "react";

import { IonRow } from "@ionic/react";

import * as db from "../db";

const MessageCard = ({ user, order, content }) => {
  return (
    <IonRow>
      <div class="wrapper">
        <div class={user + " message " + order}>{content}</div>
      </div>
    </IonRow>
  );
};

export default MessageCard;
