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
  let [skillList, setSkillList] = useState({});
  let [skills, setSkills] = useState([]);

  let user = globalState.user;

  useEffect(() => {
    db.getSkillsList().then((skills) => {
      setSkillList(skills.all);
    });
  }, []);

  async function updateUser() {
    user.skills = skills;
    await db.updateUser(user.id, {
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
            <IonButton onClick={updateUser}>
              <IonIcon icon={checkmarkOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <SkillsEdit
          skillList={skillList}
          skills={user.skills}
          onChange={(skills) => setSkills(skills)}
        />
      </IonContent>
    </IonPage>
  );
};

export default withRouter(ProfileEditSkills);
