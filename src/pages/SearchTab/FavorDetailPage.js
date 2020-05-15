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
  IonAlert,
} from "@ionic/react";

import "./FavorDetailPage.css";

import { withRouter } from "react-router";

import RatingIcons from "../../components/RatingIcons";

import ImageCard from "../../components/ImageCard";

import {
  ellipsisHorizontal,
  checkmarkCircleOutline,
  closeCircleOutline,
  chatbubbleEllipsesOutline,
} from "ionicons/icons";

import BackButton from "../../components/BackButton";
import Loader from "../../components/Loader";

import * as db from "../../db";
import useGlobal from "../../state";
import { states, types, triggers } from "../../scheme";
import { userToUserKey } from "../../utils";

const getAge = (birthDate) =>
  new Date().getFullYear() - new Date(birthDate).getFullYear();

const FavorDetailPage = ({ history, match }) => {
  const [globalState, globalActions] = useGlobal();
  let [isAbleToHelp, setIsAbleToHelp] = useState();
  let [isActive, setIsActive] = useState();

  // alerts
  let [showAbortAlert, setShowAbortAlert] = useState(false);
  let [showDoneAlert, setShowDoneAlert] = useState(false);

  const favorId = match.params.favorId;

  let [favor, setFavor] = useState({});
  let [user, setUser] = useState({});
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    db.getFavor(favorId).then((favor) => {
      db.getUser(favor.ownerId).then((user) => {
        setFavor(favor);
        setUser(user);

        setIsAbleToHelp(globalState.userId !== favor.ownerId);

        setIsActive(favor.state == "active");
      });
    });
  }, []);

  let { title, description, location, dateCreated, state } = favor;

  const handleHelp = async () => {
    let sender = globalState.userId;
    let receiver = favor.ownerId;
    let conversationId = await db.storeConversation(sender, receiver);
    // Connect favor with user that will be doing it
    // and change state from free to pending
    await db.updateFavor(favorId, {
      userId: sender,
      state: states.favor.pending,
    });
    if (conversationId) {
      db.storeMessage(
        conversationId,
        {
          senderId: sender,
          favorId: favorId,
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
    }
  };

  function returnHelpButton() {
    if (isAbleToHelp === true && isActive === false) {
      return (
        <IonButton
          disabled={isAbleToHelp === false}
          className="bigButton"
          size="large"
          color="dark"
          expand="block"
          onClick={handleHelp}
        >
          Help {user.name}
        </IonButton>
      );
    }
  }

  function returnActiveFavorButtons() {
    if (isActive)
      return (
        <IonRow>
          <IonCol>
            <IonButton
              expand="block"
              color="danger"
              fill="outline"
              onClick={() => setShowAbortAlert(true)}
            >
              <IonIcon icon={closeCircleOutline} />
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              expand="block"
              color="success"
              fill="outline"
              onClick={() => setShowDoneAlert(true)}
            >
              <IonIcon icon={checkmarkCircleOutline} />
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              expand="block"
              fill="outline"
              onClick={() => {
                // Forward to conversation page
                const conversationId = userToUserKey(
                  favor.ownerId,
                  favor.userId
                );
                history.push(`/messages/conversation/${conversationId}`);
              }}
            >
              <IonIcon icon={chatbubbleEllipsesOutline} />
            </IonButton>
          </IonCol>
        </IonRow>
      );
  }

  return (
    <IonPage>
      <Loader data={favor}>
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
              <BackButton />
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
            <IonTitle>Favor</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonAlert
            isOpen={showAbortAlert}
            onDidDismiss={() => setShowAbortAlert(false)}
            header={"Jesi li siguran da više ne želiš pomoći?"}
            buttons={[
              {
                text: "Ne",
                role: "cancel",
                cssClass: "secondary",
                handler: () => {},
              },
              {
                text: "Da",
                handler: async () => {
                  const { ownerId, userId } = favor;
                  const conversationId = userToUserKey(ownerId, userId);
                  // Set favor state from active to free
                  await db.setFavorState(favorId, states.favor.free);
                  await db.storeMessage(
                    conversationId,
                    {
                      senderId: userId,
                      favorId: favorId,
                      trigger: triggers.abort,
                    },
                    types.message.smallNotification
                  );
                  // Hide buttons
                  setIsAbleToHelp(false);
                  setIsActive(false);
                },
              },
            ]}
          />
          <IonAlert
            isOpen={showDoneAlert}
            onDidDismiss={() => setShowDoneAlert(false)}
            header={"Želiš li obavijestiti vlasnika da si gotov s uslugom?"}
            buttons={[
              {
                text: "Ne",
                role: "cancel",
                cssClass: "secondary",
                handler: () => {},
              },
              {
                text: "Da",
                handler: async () => {
                  const { ownerId, userId } = favor;
                  const conversationId = userToUserKey(ownerId, userId);
                  // Set favor state from active to done
                  await db.setFavorState(favorId, states.favor.done);
                  await db.storeMessage(
                    conversationId,
                    {
                      senderId: userId,
                      favorId: favorId,
                      trigger: triggers.done,
                    },
                    types.message.smallNotification
                  );
                  // Hide buttons
                  setIsAbleToHelp(false);
                  setIsActive(false);
                },
              },
            ]}
          />
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
          <IonGrid>
            {returnHelpButton()}
            {returnActiveFavorButtons()}
          </IonGrid>
        </IonContent>
      </Loader>
    </IonPage>
  );
};

export default withRouter(FavorDetailPage);
