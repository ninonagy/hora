import React, { useState, useEffect } from "react";
import {
  IonText,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButton,
} from "@ionic/react";
import { withRouter } from "react-router";

import * as db from "../db";

import useGlobal from "../state";

const LoginPage = (props) => {
  const [globalState, globalActions] = useGlobal();
  const { history } = props;

  let [userId, setUserId] = useState();

  // demo
  useEffect(() => {
    setUserId("u1");
  }, []);
  handleLogin();

  // Password verification

  function handleLogin() {
    db.getUser(userId)
      .then((user) => {
        // Set user session
        globalActions.setAuthUser(userId);
        // Set user data in global store
        globalActions.setUser(user);
        history.push("/");
      })
      .catch((error) => {});
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login / Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <Ion-Content>
        <IonButton onClick={handleLogin}>Click on me to Login</IonButton>
      </Ion-Content>
    </IonPage>
  );
};

export default withRouter(LoginPage);
