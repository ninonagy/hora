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

import useGlobal from "../../state";

import { fs } from "../../firebase";
import { paths, buildPath } from "../../db";
import { arrayWithId } from "../../utils";

const MessagesPage = (props) => {
  const [globalState, globalActions] = useGlobal();
  let [conversations, setConversations] = useState([]);

  useEffect(() => {
    fs.collection(
      buildPath(paths.userConversation, {
        userId: globalState.userId,
        conversationId: "",
      })
    )
      .orderBy("dateCreated", "desc")
      .get()
      .then((result) => {
        setConversations(arrayWithId(result));
      });
  }, []);

  return (
    <IonPage>
      <Loader data={conversations.length || true}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Messages</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList inset="true">
            {conversations.map(
              (conversation) =>
                conversation.active && (
                  <MessagesCard
                    key={conversation.id}
                    userId={conversation.receiverId}
                    link={`${props.match.url}/conversation/${conversation.id}`}
                  />
                )
            )}
          </IonList>
        </IonContent>
      </Loader>
    </IonPage>
  );
};

export default withRouter(MessagesPage);
