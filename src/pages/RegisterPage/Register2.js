import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonButton,
  IonRow,
  IonCol,
} from "@ionic/react";
import { withRouter, Redirect } from "react-router";

import "../LoginPage.css";
import SkillsEdit from "../../components/SkillsEditComponent";

import useGlobal from "../../state";
import * as db from "../../db";

const Register2 = (props) => {
  const [globalState, globalActions] = useGlobal();
  let [skills, setSkills] = useState([]);
  let [skillList, setSkillList] = useState({});

  let user = globalState.user;

  useEffect(() => {
    if (user.skills != null) setSkills(user.skills);
  });

  useEffect(() => {
    db.getSkillsList().then((skills) => {
      setSkillList(skills.all);
    });
  }, []);

  function updateUser() {
    user.skills = skills;
    db.updateUser(user.id, {
      skills: user.skills,
    });
    globalActions.setUser(user);
    props.history.push(`/`);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonRow>
          <IonCol className="col1"></IonCol>
          <IonCol className="col2"></IonCol>
          <IonCol className="col3"></IonCol>
          <IonCol className="col4"></IonCol>
        </IonRow>
      </IonHeader>
      <IonContent>
        <h2 className="description">
          Molimo te da odabereš načine na koje možeš pomoći drugima! (:
        </h2>
        <SkillsEdit
          skillList={skillList}
          skills={skills}
          onChange={(skills) => setSkills(skills)}
        />
        <IonRow className="ion-justify-content-center">
          <IonButton
            fill="clear"
            color="dark"
            className="login-button"
            onClick={() => updateUser()}
          >
            GOTOVO
          </IonButton>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(Register2);
