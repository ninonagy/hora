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

import "../LoginPage.css";

import * as db from "../../db";

import useGlobal from "../../state";

const RegisterPage = (props) => {
  const [globalState, globalActions] = useGlobal();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  let [userId, setUserId] = useState();
  let [isAuth, setIsAuth] = useState(false);

  function handleRegistration() {
    if (name && surname && email && password && password == password2) {
      db.storeUser({
        name: name,
        surname: surname,
        email: email,
        password: password,
        pictureLink: "https://api.adorable.io/avatars/110/" + email + ".png",
      }).then(() => {
        logInUser();
      });
    } else alert("nesto si zeznuo frende!");
  }

  function logInUser() {
    db.getUserByAuth(email, password)
      .then((user) => {
        // Set user session
        globalActions.setAuthUser(user.id);
        // Set user data in global store
        globalActions.setUser(user);
        setIsAuth(true);
        props.history.push(`/register/2/`);
      })
      .catch(() => {
        // TODO: Handle error
      });
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
        <h2 className="heading2">hip hip</h2>
        <h1 className="heading">HORA</h1>
        <IonCard className="login-card">
          <IonInput
            className="login-input"
            placeholder="ime"
            onIonChange={(e) => setName(e.target.value)}
          ></IonInput>
          <IonInput
            className="login-input"
            placeholder="prezime"
            onIonChange={(e) => setSurname(e.target.value)}
          ></IonInput>

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

          <IonInput
            className="login-input"
            placeholder="ponovi password"
            type="password"
            onIonChange={(e) => setPassword2(e.target.value)}
          ></IonInput>

          <IonButton
            fill="clear"
            color="dark"
            className="login-button"
            expand="block"
            onClick={() => handleRegistration()}
          >
            REGISTRACIJA
          </IonButton>
        </IonCard>
        <IonButton
          fill="clear"
          color="dark"
          className="login-button"
          expand="block"
          onClick={() => props.history.push("/login")}
        >
          ili se prijavi
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(RegisterPage);
