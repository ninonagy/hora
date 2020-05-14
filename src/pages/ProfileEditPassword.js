import React, { useEffect, useState } from "react";
import {
  IonItem,
  IonLabel,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonInput,
  IonAlert,
} from "@ionic/react";

import { withRouter } from "react-router";

import { checkmarkOutline } from "ionicons/icons";

import CryptoJS from "crypto-js";

import "./ProfilePage.css";

import BackButton from "../components/BackButton";
import Loader from "../components/Loader";

import useGlobalState from "../state";
import * as db from "../db";

const ProfileEditPassword = ({ history }) => {
  const [globalState, globalActions] = useGlobalState();

  let [user, setUser] = useState({});

  let userId = globalState.userId;

  let [passwordState, setPassword] = useState();
  let [currPasswordState, setCurrPassword] = useState();
  let [repeatPasswordState, setRepeatPassword] = useState();

  const [showWrongPasswordAlert, setWrongPasswordAlert] = useState(false);
  const [showPasswordsNotMatching, setPasswordsNotMatching] = useState(false);

  useEffect(() => {
    db.getUser(userId).then((user) => {
      setUser(user);
    });
  });

  function handlePasswordEdit() {
    if (currPasswordState != user.password) setWrongPasswordAlert(true);
    else if (passwordState && passwordState != repeatPasswordState)
      setPasswordsNotMatching(true);
    else
      db.updateUser(userId, { password: passwordState }).then(history.goBack());
  }

  /* 
    We are aware storing passwords this way is
    far from perfect, but it is much easier to test things
    this way. It will be upgraded very soon.
  */

  const getPassHash = (pass) => {
    const hash = CryptoJS.SHA256(pass);
    const secret_buffer = CryptoJS.enc.Base64.parse("secret");
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA512, secret_buffer);
    hmac.update(hash, secret_buffer);
    return hmac.finalize().toString(CryptoJS.enc.Base64);
  };

  return (
    <IonPage>
      <Loader data={user}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <BackButton />
            </IonButtons>
            <IonTitle>Change Password</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => handlePasswordEdit()}>
                <IonIcon icon={checkmarkOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonAlert
            isOpen={showWrongPasswordAlert}
            onDidDismiss={() => setWrongPasswordAlert(false)}
            header={"Greška!"}
            message={"Trenutni password nije ispravan!"}
            buttons={["OK"]}
          />
          <IonAlert
            isOpen={showPasswordsNotMatching}
            onDidDismiss={() => setPasswordsNotMatching(false)}
            header={"Greška!"}
            message={"Passwordi se ne podudaraju!"}
            buttons={["OK"]}
          />
          <IonList className="ion-no-margin ion-no-padding">
            <IonItem>
              <IonLabel position="stacked">Trenuti password</IonLabel>
              <IonInput
                type="password"
                pattern="password"
                onIonChange={(e) =>
                  setCurrPassword(getPassHash(e.target.value))
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Novi password</IonLabel>
              <IonInput
                type="password"
                pattern="password"
                onIonChange={(e) => setPassword(getPassHash(e.target.value))}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Ponovi novi password</IonLabel>
              <IonInput
                type="password"
                pattern="password"
                onIonChange={(e) =>
                  setRepeatPassword(getPassHash(e.target.value))
                }
              />
            </IonItem>
          </IonList>
        </IonContent>
      </Loader>
    </IonPage>
  );
};

export default withRouter(ProfileEditPassword);
