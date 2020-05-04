import React, { useState, useEffect } from "react";
import {
  IonText,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButtons,
  IonBackButton,
  IonAvatar,
  IonIcon,
  IonImg,
  IonButton,
  IonPopover,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

import "./FavorDetailPage.css";

import { withRouter } from "react-router";

import RatingIcons from "../../components/RatingIcons";

import ImageCard from "../../components/ImageCard";

import { ellipsisHorizontal } from "ionicons/icons";

import * as db from "../../db";
import useGlobal from "../../state";

const items = [
  { src: "http://placekitten.com/g/100/100", text: "this is my cat Minnie" },
  { src: "http://placekitten.com/g/101/100", text: "this is my cat John" },
];

const getAge = (birthDate) =>
  new Date().getFullYear() - new Date(birthDate).getFullYear();

const FavorDetailPage = ({ history, match }) => {
  const [globalState, globalActions] = useGlobal();
  let favorId = match.params.favorId;

  let [favor, setFavor] = useState({});
  let [user, setUser] = useState({});
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    db.getFavor(favorId).then((favor) => {
      db.getUser(favor.ownerId).then((user) => {
        setFavor(favor);
        setUser(user);
      });
    });
  }, [favorId]);

  let { title, description, location, dateCreated } = favor;

  function handleHelp() {
    let { name } = globalState.user;
    let sender = globalState.userId;
    let receiver = favor.ownerId;
    db.storeConversation(sender, receiver).then((conversationId) => {
      db.storeMessage(
        conversationId,
        {
          senderId: sender,
          content: favorId,
          dateCreated: new Date().toISOString(),
        },
        "notification"
      )
        .then(() => {
          // When conversation thread is created and message stored, forward user to chat
          history.push(`/messages/conversation/${conversationId}`);
        })
        .catch(() => {
          // TODO: Handle error
        });
    });
  }

  return (
    <IonPage>
      <IonPopover
        isOpen={showPopover.open}
        event={showPopover.event}
        onDidDismiss={(e) => setShowPopover({ open: false })}
      >
        <ion-list>
          <ion-item>Report</ion-item>
          <ion-item>Share</ion-item>
        </ion-list>
      </IonPopover>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              onClick={(e) =>
                setShowPopover({ open: true, event: e.nativeEvent })
              }
            >
              <IonIcon icon={ellipsisHorizontal} />
            </IonButton>
          </IonButtons>
          <IonTitle className="favor-title">Favor</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow onClick={() => history.push(`/user/${favor.ownerId}`)}>
            <IonCol offset="1" size="3">
              <IonAvatar className="favor-avatar">
                <IonImg src={user.pictureLink} />
              </IonAvatar>
            </IonCol>
            <IonCol>
              {user.name}, {getAge(user.birthDate)}
              <br />
              <RatingIcons rating={user.rating} />
            </IonCol>
          </IonRow>
        </IonGrid>
        <div className="favor-text">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="image-card-wrapper">
          <ImageCard
            url="http://placekitten.com/230/520"
            caption="This is Minnie"
            orientation="portrait"
          />
          <ImageCard
            url="http://placekitten.com/421/230"
            caption="Haha! Cute Maxie!"
            orientation="landscape"
          />
          <ImageCard
            url="http://placekitten.com/250/500"
            caption="(:"
            orientation="portrait"
          />
          <ImageCard
            url="http://placekitten.com/230/230"
            caption="Ohhh look at Foxie!"
            orientation="landscape"
          />
        </div>

        <IonButton
          disabled={favor.ownerId === globalState.userId}
          className="button-do-it"
          size="large"
          color="dark"
          expand="block"
          onClick={handleHelp}
        >
          HELP
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(FavorDetailPage);
