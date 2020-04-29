import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonButton,
  IonCard,
  IonItem,
  IonInput,
  IonList,
  IonCardHeader,
  IonRow,
  IonCol,
} from "@ionic/react";
import { withRouter, Redirect } from "react-router";

import "./LoginPage.css";

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
          globalActions.setAuthUser(userId, user);
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
          <IonRow>
            <IonCol className="col1"></IonCol>
            <IonCol className="col2"></IonCol>
            <IonCol className="col3"></IonCol>
            <IonCol className="col4"></IonCol>
          </IonRow>
        </IonHeader>
        <IonContent>
          <h2 className="heading2">Bok, ovo je</h2>
          <h1 className="heading">HORA</h1>
          <IonCard class="login-card">
            <IonInput
              className="login-input"
              inputMode="email"
              placeholder="e-mail"
            ></IonInput>

            <IonInput
              className="login-input"
              placeholder="password"
              type="password"
            ></IonInput>

            <IonButton
              fill="clear"
              color="dark"
              className="login-button"
              expand="block"
              onClick={handleLogin}
            >
              PRIJAVA
            </IonButton>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }
};

export default withRouter(LoginPage);
