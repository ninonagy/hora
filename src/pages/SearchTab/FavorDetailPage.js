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
  IonCard,
  IonCardContent,
  IonChip,
  IonLabel,
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
  calendarOutline,
  locationOutline,
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
  let [favorState, setFavorState] = useState();
  let [skillList, setSkillList] = useState({});

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

        setFavorState(favor.state);
      });
    });
  }, []);

  useEffect(() => {
    db.getSkillsList().then((skills) => {
      setSkillList(skills.all);
    });
  }, []);

  let { title, description, location, dateCreated, state, skills } = favor;

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
    if (isAbleToHelp === true && favorState == "free") {
      return (
        <IonButton
          disabled={isAbleToHelp === false}
          className="bigButton"
          color="dark"
          expand="block"
          fill="outline"
          onClick={handleHelp}
        >
          Učini uslugu
        </IonButton>
      );
    }
  }

  function returnActiveFavorButtons() {
    if (isAbleToHelp === true && favorState == "active")
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

  var months = {
    1: "siječnja",
    2: "veljače",
    3: "ožujka",
    4: "travnja",
    5: "svibnja",
    6: "lipnja",
    7: "srpnja",
    8: "kolovoza",
    9: "rujna",
    10: "listopada",
    11: "studenog",
    12: "prosinca",
  };

  function returnDate(dateCreated) {
    if (dateCreated) {
      const date = new Date(dateCreated);
      const today = new Date();
      if (
        today.getDate() == date.getDate() &&
        today.getMonth() == date.getMonth()
      )
        return `Danas, ${date.getHours()}:${date.getMinutes()}`;
      else if (
        today.getDate() - 1 == date.getDate() &&
        today.getMonth() == date.getMonth()
      )
        return `Jučer, ${date.getHours()}:${date.getMinutes()}`;
      else
        return `${date.getDate()}. ${
          months[date.getMonth() + 1]
        }, ${date.getHours()}:${date.getMinutes()}`;
    }
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
                  setFavorState("free");
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
                  setFavorState("done");
                },
              },
            ]}
          />

          <IonCard
            className="favor-user"
            style={{
              background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("https://picsum.photos/seed/${user.email}/500/300?blur=10")`,
            }}
          >
            <IonCardContent
              onClick={() => history.push(`/user/${favor.ownerId}`)}
            >
              <IonGrid>
                <IonRow class="ion-align-items-center">
                  <IonCol size="4">
                    <IonAvatar className="favor-avatar">
                      <IonImg src={user.pictureLink} />
                    </IonAvatar>
                  </IonCol>
                  <IonCol>
                    <IonText className="FavorUserName">
                      {user.name}, {getAge(user.birthDate)}
                    </IonText>
                    <br />
                    <RatingIcons
                      timeEarned={user.timeEarned}
                      timeSpent={user.timeSpent}
                    />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol></IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          <div className="favor-text">
            <h1>{title}</h1>

            <IonIcon className="favor-detail-icon" icon={locationOutline} />
            <span className="favor-detail-text">Zagreb</span>
            <IonIcon
              className="favor-detail-icon"
              icon={calendarOutline}
              style={{ marginLeft: "30px" }}
            />
            <span className="favor-detail-text">{returnDate(dateCreated)}</span>

            <p>{description}</p>
            <div className="favor-skills">
              {skills
                ? skills.map((skill) => (
                    <IonChip outline="true">
                      <IonLabel>{skillList[skill]}</IonLabel>
                    </IonChip>
                  ))
                : ""}
            </div>
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
