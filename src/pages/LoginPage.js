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
import { withRouter, Redirect } from "react-router";

import * as db from "../db";

import useGlobal from "../state";

const LoginPage = (props) => {
  const [globalState, globalActions] = useGlobal();

  let [userId, setUserId] = useState();
  let [isAuth, setIsAuth] = useState(false);

  // demo
  useEffect(() => {
    setUserId("u1");
  }, []);
  handleLogin();

  function handleLogin() {
    if (userId && !globalState.isAuthenticated) {
      db.getUser(userId)
        .then((user) => {
          // TODO: Password verification
          // Set user session
          globalActions.setAuthUser(userId);
          // Set user data in global store
          globalActions.setUser(user);
          setIsAuth(true);
        })
        .catch((error) => {});
    }
  }

  if (isAuth) {
    let { state } = props.location;
    let path = "/home";
    if (state) path = state.from.pathname;
    return <Redirect to={path} />;
  } else {
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
  }
};

export default withRouter(LoginPage);
