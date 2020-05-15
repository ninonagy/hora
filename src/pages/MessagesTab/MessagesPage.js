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
import useCache from "../../hooks/useCache";
import { arrayWithId } from "../../utils";

function getConversations(path) {
  return fs.collection(path).orderBy("dateCreated", "desc").get();
}

const MessagesPage = (props) => {
  const [globalState, {}] = useGlobal();

  let conversations = useCache(
    getConversations,
    buildPath(paths.userConversation, {
      userId: globalState.userId,
      conversationId: "",
    })
  );

  conversations = conversations || arrayWithId(conversations);

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
