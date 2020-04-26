import React from "react";
import {
  IonText,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonList,
} from "@ionic/react";

import { withRouter } from "react-router";
import MessagesCard from "../../components/MessagesCard";

const MessagesPage = (props) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Messages</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList inset="true">
          {["1", "2", "3"].map((id) => (
            <MessagesCard />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(MessagesPage);
