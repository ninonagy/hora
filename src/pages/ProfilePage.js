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
} from "@ionic/react";

import { withRouter } from "react-router";

import { settingsOutline } from "ionicons/icons";

import RatingIcons from "../components/RatingIcons";

import "./ProfilePage.css";

import BackButton from "../components/BackButton";
import Loader from "../components/Loader";

import useGlobalState from "../state";
import * as db from "../db";

const getAge = (birthDate) =>
  new Date().getFullYear() - new Date(birthDate).getFullYear();

const ProfilePage = ({ history, match, isPublic }) => {
  const [globalState, globalActions] = useGlobalState();
  let [user, setUser] = useState({});
  let [skillList, setSkillList] = useState({});

  useEffect(() => {
    if (isPublic) {
      db.getUser(match.params.userId).then((user) => {
        setUser(user);
      });
    } else {
      setUser(globalState.user);
    }
  }, [globalState.user]);

  useEffect(() => {
    db.getSkillsList().then((skills) => {
      setSkillList(skills.all);
    });
  }, []);

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
          <IonGrid class="profile-margin">
            <IonRow class="ion-align-items-center">
              <IonCol size="2" offset="4">
                <IonAvatar className="profile-avatar">
                  <IonImg src={pictureLink} alt="Avatar" />
                </IonAvatar>
              </IonCol>
              {/** I know this look terrible. I'm sorry. I'll update it asap. */}
              <IonCol size="2" offset="3">
                <div class="profile-coins">{timeAvailable}</div> coins
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center profile-name">
                {name}, {getAge(birthDate)}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center">
                <RatingIcons rating={rating} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center profile-bio">{bio}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center profile-bio">
                {skills.map((item) => (
                  <IonChip>
                    <IonLabel>{skillList[item]}</IonLabel>
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
