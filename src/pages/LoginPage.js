import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonButton,
  IonCard,
  IonInput,
  IonRow,
  IonCol,
} from "@ionic/react";
import { withRouter, Redirect } from "react-router";

import "./LoginPage.css";

import useGlobal from "../state";
import { authService } from "../services";

const LoginPage = (props) => {
  const [globalState, globalActions] = useGlobal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Try to get user from local storage
    let user = authService.getUserValue();
    if (user && !isAuth) {
      globalActions.setAuthUser(user);
      setIsAuth(true);
    }
  }, []);

  function logInUser() {
    authService
      .login(email, password)
      .then((user) => {
        globalActions.setAuthUser(user);
        setIsAuth(true);
      })
      .catch(() => {
        // TODO: Handle error
      });
  }

  if (isAuth) {
    let { state } = props.location;
    let path = "/home";
    if (state?.from) path = state.from.pathname;
    // Forward user to previous page or to default page
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
          <IonCard className="login-card">
            <IonInput
              className="login-input"
              inputMode="email"
              placeholder="e-mail"
              onIonChange={(e) => setEmail(e.target.value)}
            ></IonInput>

            <IonInput
              className="login-input"
              placeholder="password"
              type="password"
              onIonChange={(e) => setPassword(e.target.value)}
            ></IonInput>

            <IonButton
              fill="clear"
              color="dark"
              className="login-button"
              expand="block"
              onClick={logInUser}
            >
              PRIJAVA
            </IonButton>
          </IonCard>
          <IonButton
            fill="clear"
            color="dark"
            className="login-button"
            expand="block"
            onClick={() => props.history.push("/register")}
          >
            ili se registriraj
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }
};

export default withRouter(LoginPage);
