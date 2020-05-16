import React, { useEffect, useState } from "react";
import {
  IonText,
  IonItem,
  IonChip,
  IonLabel,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
  IonIcon,
  IonImg,
  IonBackButton,
  IonBadge,
} from "@ionic/react";

import { withRouter } from "react-router";

import { settingsOutline } from "ionicons/icons";

import RatingIcons from "../components/RatingIcons";

import "./ProfilePage.css";

import BackButton from "../components/BackButton";
import Loader from "../components/Loader";

import useGlobalState from "../state";
import * as db from "../db";
import useCache from "../hooks/useCache";

const getAge = (birthDate) =>
  new Date().getFullYear() - new Date(birthDate).getFullYear();

const ProfilePage = ({ history, match, isPublic }) => {
  const [globalState, {}] = useGlobalState();
  // let [skillList, setSkillList] = useState({});

  let user = useCache(
    () => db.getUser(isPublic ? match.params.userId : globalState.userId),
    isPublic ? `/user/${match.params.userId}` : `user`
  );

  const skillList = useCache(db.getSkillsList, `/skills`);

  let {
    name,
    surname,
    email,
    bio,
    birthDate,
    location,
    rating,
    timeSpent,
    timeEarned,
    skills,
    pictureLink,
  } = user;

  skills = skills || [];

  let timeAvailable = timeEarned - timeSpent;

  return (
    <IonPage>
      <Loader data={user}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <BackButton />
            </IonButtons>
            <IonTitle>Profile</IonTitle>
            {!isPublic && (
              <IonButtons slot="end">
                <IonButton onClick={() => history.push("profile/edit")}>
                  <IonIcon icon={settingsOutline} />
                </IonButton>
              </IonButtons>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div
            className="profile-cover"
            style={{
              background: `linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url("https://picsum.photos/seed/${email}/500/300")`,
            }}
          ></div>
          <IonGrid class="profile-margin">
            <IonRow class="ion-align-items-center">
              <IonCol size="2" offset="4">
                <IonAvatar className="profile-avatar">
                  <IonImg src={pictureLink} alt="Avatar" />
                </IonAvatar>
              </IonCol>
              <IonCol size="2" offset="3">
                <div class="profile-coins">
                  <p>{timeAvailable}</p>
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center profile-name">
                {name}, {getAge(birthDate)}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center">
                <RatingIcons timeEarned={timeEarned} timeSpent={timeSpent} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center profile-bio">{bio}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center profile-bio">
                {skillList.all &&
                  skills.map((skill) => (
                    <IonChip>
                      <IonLabel>{skillList.all[skill]}</IonLabel>
                    </IonChip>
                  ))}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </Loader>
    </IonPage>
  );
};

export default withRouter(ProfilePage);
