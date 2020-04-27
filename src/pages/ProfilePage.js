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
  IonCol
} from "@ionic/react";
import { withRouter } from "react-router";

import useGlobalState from "../state";
import * as db from "../db";

const getAge = birthDate =>
  new Date().getFullYear() - new Date(birthDate).getFullYear();

const ProfilePage = ({ match }) => {
  const [globalState, globalActions] = useGlobalState();
  let [user, setUser] = useState({});

  let userId = globalState.userId;

  useEffect(() => {
    db.getUser(userId).then(user => {
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
    pictureLink
  } = user;

  skills = skills || [];

  let timeAvailable = timeEarned - timeSpent;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {name}, {getAge(birthDate)}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonAvatar>
            <img src={pictureLink} alt="Avatar" />
          </IonAvatar>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonText>{location}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonText>Neki kratak opis</IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>

        <IonItem>
          <IonText>Vještine/Hobiji</IonText>
          {skills.map(item => (
            <IonChip>
              <IonLabel>{item}</IonLabel>
            </IonChip>
          ))}
        </IonItem>

        <IonItem>
          <IonText>Novčići: {timeAvailable}</IonText>
        </IonItem>

        <IonItem>
          <IonText>Ocjena: {rating}</IonText>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(ProfilePage);
