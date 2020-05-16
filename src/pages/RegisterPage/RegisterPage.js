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
  IonAlert,
  IonDatetime,
  IonLabel,
} from "@ionic/react";
import { withRouter, Redirect } from "react-router";

import { getPassHash } from "../../utils";

import "../LoginPage.css";

import * as db from "../../db";

import useGlobal from "../../state";
import { authService } from "../../services";

const RegisterPage = (props) => {
  const [globalState, globalActions] = useGlobal();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  let [userId, setUserId] = useState();
  let [isAuth, setIsAuth] = useState(false);

  const [showInvalidEmailAddress, setInvalidEmailAddress] = useState(false);
  const [showPasswordsNotMatching, setPasswordsNotMatching] = useState(false);
  const [showAllFieldsAreRequired, setAllFieldsAreRequired] = useState(false);

  function handleRegistration() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email.toLowerCase())) {
      setInvalidEmailAddress(true);
    } else if (password != password2) {
      setPasswordsNotMatching(true);
    } else if (name && surname && email && password && password2) {
      db.storeUser({
        name: name,
        surname: surname,
        email: email,
        password: password,
        birthDate: birthDate.toISOString(),
        location: "Zagreb",
        bio: "Hello! 👋",
        pictureLink: "https://api.adorable.io/avatars/110/" + email + ".png",
      }).then(() => {
        logInUser();
      });
    } else setAllFieldsAreRequired(true);
  }

  function logInUser() {
    authService
      .login(email, password)
      .then((user) => {
        setIsAuth(true);
        globalActions.setAuthUser(user);
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
        <IonAlert
          isOpen={showInvalidEmailAddress}
          onDidDismiss={() => setInvalidEmailAddress(false)}
          header={"Greška!"}
          message={email + " nije ispravna email adresa!"}
          buttons={["OK"]}
        />
        <IonAlert
          isOpen={showPasswordsNotMatching}
          onDidDismiss={() => setPasswordsNotMatching(false)}
          header={"Greška!"}
          message={"Passwordi se ne podudaraju!"}
          buttons={["OK"]}
        />
        <IonAlert
          isOpen={showAllFieldsAreRequired}
          onDidDismiss={() => setAllFieldsAreRequired(false)}
          header={"Greška!"}
          message={"Sva polja su obavezna!"}
          buttons={["OK"]}
        />
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

          <IonDatetime
            monthShortNames="siječnja, veljače, ožujka, travnja, svibnja, lipnja, srpnja, kolovoza, rujna, listopada, studenog, prosinca"
            display-format="DD. MMM YYYY."
            picker-format="DD. MMM YYYY."
            max={new Date().toISOString()}
            className="login-input"
            placeholder="datum rođenja"
            onIonChange={(e) =>
              setBirthDate(
                new Date(e.target.value.replace(/-/g, "/").replace("T", " "))
              )
            }
          ></IonDatetime>

          <IonInput
            className="login-input"
            placeholder="password"
            type="password"
            onIonChange={(e) => setPassword(getPassHash(e.target.value))}
          ></IonInput>

          <IonInput
            className="login-input"
            placeholder="ponovi password"
            type="password"
            onIonChange={(e) => setPassword2(getPassHash(e.target.value))}
          ></IonInput>

          <IonRow>
            <IonCol className="ion-text-center register-warninig">
              Upozorenje: Hora je u Alpha fazi razvoja, stoga ne možemo
              garantirati sigurnost Vaših podataka.
            </IonCol>
          </IonRow>

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
