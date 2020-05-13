import React, { useEffect, useState } from "react";
import {
  IonItem,
  IonLabel,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonInput,
  IonAlert,
} from "@ionic/react";

import { withRouter } from "react-router";

import { checkmarkOutline } from "ionicons/icons";

import "./ProfilePage.css";

import BackButton from "../components/BackButton";
import SkillsEdit from "../components/SkillsEditComponent";
import useGlobal from "../state";
import * as db from "../db";

const ProfileEditSkills = ({ history }) => {
  const [globalState, globalActions] = useGlobal();
  let [skills, setSkills] = useState([]);

  let user = globalState.user;

  useEffect(() => {
    setSkills(user.skills);
  });

  function updateUser() {
    user.skills = skills;
    db.updateUser(user.id, {
      skills: user.skills,
    });
    globalActions.setUser(user);
    history.goBack();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton />
          </IonButtons>
          <IonTitle>Edit skills</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => updateUser()}>
              <IonIcon icon={checkmarkOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <SkillsEdit skills={skills} onChange={(skills) => setSkills(skills)} />
      </IonContent>
    </IonPage>
  );
};

export default withRouter(ProfileEditSkills);
