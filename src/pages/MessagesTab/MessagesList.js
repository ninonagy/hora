import React from "react";
import { withRouter } from "react-router";
import { useStore } from "./model";

import MessageCard from "../../components/Cards/MessageCard";
import NotificationCard from "../../components/Cards/NotificationCard";
import SmallNotificationCard from "../../components/Cards/SmallNotificationCard";

import { types } from "../../scheme";
import { IonList } from "@ionic/react";
import { getState } from "react-model";

const messageOrder = (messages, id, idprev) => {
  if (
    messages[idprev] != null &&
    messages[idprev].senderId === messages[id].senderId
  )
    return "next";
};

/*
0 - does not display anything
1 - displays time
2 - displays date and time

(it is not handling years yet)
*/

const showTimeIndex = (messages, id) => {
  var idPrev = id - 1;
  if (messages[idPrev] != null) {
    var currentMessage = new Date(messages[id].dateCreated);
    var prevMessage = new Date(messages[idPrev].dateCreated);

    if (
      currentMessage.getDate() === prevMessage.getDate() &&
      currentMessage.getMonth() === prevMessage.getMonth()
    ) {
      var diff =
        currentMessage.getHours() * 60 +
        currentMessage.getMinutes() -
        (prevMessage.getHours() * 60 + prevMessage.getMinutes());
      if (diff > 60) return 1;
      else return 0;
    } else return 2;
  } else return 2;
};

const MessageType = ({ history, message, index }) => {
  const [state, actions] = useStore("Conversation");

  let showTime = showTimeIndex(state.messages, index);
  let isThisUser = state.senderId === message.senderId ? true : false;

  let messageComponent;

  switch (message.type) {
    case types.message.message:
      messageComponent = (
        <MessageCard
          direction={isThisUser ? "right" : "left"}
          order={messageOrder(state.messages, index, index - 1)}
          showTime={showTime}
          message={message}
        />
      );
      break;
    case types.message.notification:
      messageComponent = (
        <NotificationCard
          message={message}
          user={state.receiverUser}
          isThisUser={isThisUser}
          showTime={showTime}
          onUserAbort={() => actions.showAbortModal({ message, isThisUser })}
          onUserDecline={() =>
            actions.showDeclineModal({ message, isThisUser })
          }
          onUserAccept={() => actions.showAcceptModal({ message, isThisUser })}
          onClick={() => history.push(`/favor/${message.favorId}`)}
        />
      );
      break;
    case types.message.smallNotification:
      messageComponent = (
        <SmallNotificationCard
          message={message}
          user={state.receiverUser}
          isThisUser={isThisUser}
          showTime={showTime}
          onUserReview={(userRole) =>
            actions.updateMessageWhenUserReview({ message, userRole })
          }
          onClick={() => history.push(`/favor/${message.favorId}`)}
        />
      );
      break;
    default:
      return null;
  }

  return messageComponent;
};

const MessagesList = ({ messages, history }) => {
  return (
    <IonList>
      {messages.map((message, index) => (
        <MessageType
          key={message.id}
          message={message}
          index={index}
          history={history}
        />
      ))}
    </IonList>
  );
};

export default withRouter(MessagesList);
