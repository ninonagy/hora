import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonList,
} from "@ionic/react";

import { withRouter } from "react-router";
import MessagesCard from "../../components/MessagesCard";

import Loader from "../../components/Loader";

import * as db from "../../db";
import useGlobal from "../../state";

const MessagesPage = (props) => {
  const [globalState, globalActions] = useGlobal();
  let [conversations, setConversations] = useState([]);

  useEffect(() => {
    db.getUserConversationList(globalState.userId).then((list) =>
      setConversations(list)
    );
  }, []);

  return (
    <IonPage>
      <Loader data={conversations}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Messages</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList inset="true">
            {conversations.map((conversation) => (
              <MessagesCard
                key={conversation.id}
                userId={conversation.receiverId}
                link={`${props.match.url}/conversation/${conversation.id}`}
              />
            ))}
          </IonList>
        </IonContent>
      </Loader>
    </IonPage>
  );
};

export default withRouter(MessagesPage);
