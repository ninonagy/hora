import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButtons,
  IonIcon,
  IonButton,
  IonPopover,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert,
  IonChip,
  IonLabel,
  IonFooter,
} from "@ionic/react";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import "./FavorDetailPage.css";

import { withRouter } from "react-router";

import ProfileCard from "../../components/Cards/ProfileCard";

import {
  ellipsisHorizontal,
  checkmarkCircleOutline,
  closeCircleOutline,
  chatbubbleEllipsesOutline,
  calendarOutline,
  locationOutline,
} from "ionicons/icons";

import BackButton from "../../components/Buttons/Back";
import Loader from "../../components/shared/Loader";

import * as db from "../../db";
import useGlobal from "../../state";
import { showDate, showTime } from "../../utils";

import { states, types, triggers } from "../../scheme";
import { userToUserKey } from "../../utils";
import useCache from "../../hooks/useCache";

const FavorDetailPage = ({ history, match }) => {
  const [globalState, globalActions] = useGlobal();
  let [isAbleToHelp, setIsAbleToHelp] = useState();
  let [favorState, setFavorState] = useState();
  let [skillList, setSkillList] = useState({});

  // alerts
  let [showAbortAlert, setShowAbortAlert] = useState(false);
  let [showDoneAlert, setShowDoneAlert] = useState(false);

  const favorId = match.params.favorId;
  let favor = useCache(() => db.getFavor(favorId), `/favor/${favorId}`);

  let [user, setUser] = useState({});
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    if (favor) {
      db.getUser(favor.ownerId).then((user) => {
        setUser(user);
        setIsAbleToHelp(globalState.userId !== favor.ownerId);
        setFavorState(favor.state);
      });
    }
  }, [favor]);

  useEffect(() => {
    db.getSkillsList().then((skills) => {
      setSkillList(skills.all);
    });
  }, []);

  function returnImage(picUrl) {
    if (picUrl)
      return (
        <Zoom>
          <img className="favor-image" src={picUrl} />
        </Zoom>
      );
  }

  let {
    title,
    description,
    location,
    dateCreated,
    state,
    skills,
    picUrl,
  } = favor;

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
          history.replace(`/messages/conversation/${conversationId}`);
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
          shape="round"
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

  return (
    <IonPage>
      <Loader data={favor && user}>
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
            <IonTitle>Usluga</IonTitle>
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

          <ProfileCard user={user} userId={favor.ownerId} />

          <div className="favor-text">
            <h1>{title}</h1>

            <IonIcon className="favor-detail-icon" icon={locationOutline} />
            <span className="favor-detail-text">Zagreb</span>
            <IonIcon
              className="favor-detail-icon"
              icon={calendarOutline}
              style={{ marginLeft: "30px" }}
            />
            <span className="favor-detail-text">
              {`${showDate(dateCreated)}, ${showTime(dateCreated)}`}
            </span>

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

          <div className="favor-image-wrapper">{returnImage(picUrl)}</div>
        </IonContent>
        <IonFooter className="ion-no-border">
          <IonGrid>
            {returnHelpButton()}
            {returnActiveFavorButtons()}
          </IonGrid>
        </IonFooter>
      </Loader>
    </IonPage>
  );
};

export default withRouter(FavorDetailPage);
