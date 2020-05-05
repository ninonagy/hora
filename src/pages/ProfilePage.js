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
} from "@ionic/react";

import { withRouter } from "react-router";

import { settingsOutline } from "ionicons/icons";

import RatingIcons from "../components/RatingIcons";

import "./ProfilePage.css";

import Loader from "../components/Loader";

import useGlobalState from "../state";
import * as db from "../db";

const getAge = (birthDate) =>
  new Date().getFullYear() - new Date(birthDate).getFullYear();

const ProfilePage = ({ match, isPublic }) => {
  const [globalState, globalActions] = useGlobalState();
  let [user, setUser] = useState({});

  let userId = isPublic ? match.params.userId : globalState.userId;

  useEffect(() => {
    db.getUser(userId).then((user) => {
      setUser(user);
    });
  }, [userId]);

  let {
    name,
    email,
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
            <IonTitle>
              {name}, {getAge(birthDate)}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton>
                <IonIcon icon={settingsOutline} />
              </IonButton>
            </IonButtons>
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
              <IonCol className="ion-text-center profile-name">{name}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center">
                <RatingIcons rating={rating} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center profile-bio">
                Stu(die)ing @ the uni. Doing crazy things. I have a dog! I love
                helping everybody in need! Cooking is my passion! Oh and I love
                walking my dogs: Kate and Jack.
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center profile-bio">
                {skills.map((item) => (
                  <IonChip>
                    <IonLabel>{item}</IonLabel>
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
