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
import ConversationCard from "../../components/Cards/ConversationCard";

import Loader from "../../components/shared/Loader";

import useGlobal from "../../state";

import { fs } from "../../firebase";
import { paths, buildPath } from "../../db";
import { arrayWithId } from "../../utils";

function getConversationsOrderByUpdatedAt(userId) {
  return fs
    .collection(
      buildPath(paths.userConversation, {
        userId: userId,
        conversationId: "",
      })
    )
    .orderBy("updatedAt", "desc")
    .get();
}

const MessagesPage = ({ match, reload }) => {
  const [globalState, {}] = useGlobal();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    getConversationsOrderByUpdatedAt(globalState.userId).then((result) => {
      setConversations(arrayWithId(result));
    });
  }, [reload]);

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
                  <ConversationCard
                    key={conversation.id}
                    item={conversation}
                    link={`${match.url}/conversation/${conversation.id}`}
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
