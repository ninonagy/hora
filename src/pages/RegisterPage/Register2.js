import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonButton,
  IonRow,
  IonCol,
  IonBadge,
  IonItem,
  IonCheckbox,
  IonLabel,
  IonList,
} from "@ionic/react";
import { withRouter, Redirect } from "react-router";

import "../LoginPage.css";

import useGlobalState from "../../state";
import * as db from "../../db";

const Register2 = (props) => {
  const [globalState, globalActions] = useGlobalState();
  const [checked, setChecked] = useState(false);

  let [user, setUser] = useState({});

  let userId = globalState.userId;

  let [i1, seti1] = useState(false);
  let [i2, seti2] = useState(false);
  let [i3, seti3] = useState(false);
  let [i4, seti4] = useState(false);
  let [i5, seti5] = useState(false);

  useEffect(() => {
    db.getUser(userId).then((user) => {
      setUser(user);
    });
  }, []);

  function handleInterests() {
    var skills = [];
    if (i1) skills.push("Vrlarenje");
    if (i2) skills.push("Pomoć");
    if (i3) skills.push("Šetanje");
    if (i4) skills.push("Pjevanje");
    if (i5) skills.push("Druženje");

    db.updateUser(userId, {
      skills: skills,
    });

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

        <IonList>
          <IonItem>
            <IonLabel>Vrtlarenje</IonLabel>
            <IonCheckbox slot="start" onIonChange={(e) => seti1(!i1)} />
          </IonItem>
          <IonItem>
            <IonLabel>Pomoć</IonLabel>
            <IonCheckbox slot="start" onIonChange={(e) => seti2(!i2)} />
          </IonItem>
          <IonItem>
            <IonLabel>Šetanje</IonLabel>
            <IonCheckbox slot="start" onIonChange={(e) => seti3(!i3)} />
          </IonItem>
          <IonItem>
            <IonLabel>Pjevanje</IonLabel>
            <IonCheckbox slot="start" onIonChange={(e) => seti4(!i4)} />
          </IonItem>
          <IonItem>
            <IonLabel>Druženje</IonLabel>
            <IonCheckbox slot="start" onIonChange={(e) => seti5(!i5)} />
          </IonItem>
        </IonList>

        <IonRow className="ion-justify-content-center">
          <IonButton
            fill="clear"
            color="dark"
            className="login-button"
            onClick={() => handleInterests()}
          >
            GOTOVO
          </IonButton>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(Register2);
