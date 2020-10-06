import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/react";

import { withRouter } from "react-router";

import { checkmarkOutline } from "ionicons/icons";

import "./ProfilePage.css";

import BackButton from "../../components/Buttons/Back";
import SkillsEdit from "../../components/shared/SkillsEdit";
import useGlobal from "../../state";
import * as db from "../../db";

const ProfileEditSkills = ({ history }) => {
  const [globalState, globalActions] = useGlobal();
  let [skillsList, setSkillsList] = useState({});
  let [newSkills, setNewSkills] = useState([]);

  let user = globalState.user;

  useEffect(() => {
    db.getSkillsList().then((skills) => {
      setSkillsList(skills.all);
    });
  }, []);

  async function updateUser() {
    if (newSkills.length) {
      user.skills = newSkills;
      await db.updateUser(user.id, {
        skills: user.skills,
      });
      globalActions.setUser(user);
    }
    history.goBack();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton />
          </IonButtons>
          <IonTitle>Uredi vještine</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={updateUser}>
              <IonIcon icon={checkmarkOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <SkillsEdit
          skillsList={skillsList}
          userSkills={user.skills}
          onChange={(skills) => setNewSkills(skills)}
        />
      </IonContent>
    </IonPage>
  );
};

export default withRouter(ProfileEditSkills);
