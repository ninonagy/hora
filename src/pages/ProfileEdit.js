import React, { useEffect, useState } from "react";
import {
  IonItem,
  IonChip,
  IonLabel,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
  IonIcon,
  IonImg,
  IonList,
  IonInput,
  IonItemDivider,
  IonDatetime,
  IonTextarea,
  IonAlert,
} from "@ionic/react";

import { withRouter } from "react-router";

import { checkmarkOutline } from "ionicons/icons";

import "./ProfilePage.css";

import BackButton from "../components/BackButton";
import Loader from "../components/Loader";

import useGlobalState from "../state";
import * as db from "../db";
import { authService } from "../services";

const ProfileEdit = ({ history, location }) => {
  const [globalState, globalActions] = useGlobalState();

  let [user, setUser] = useState({});
  let [skillList, setSkillList] = useState({});

  const [showInvalidEmailAddress, setInvalidEmailAddress] = useState(false);

  useEffect(() => {
    setUser(globalState.user);
  }, [globalState.user]);

  useEffect(() => {
    db.getSkillsList().then((skills) => {
      setSkillList(skills.all);
    });
  }, []);

  let { skills } = user;

  skills = skills || [];

  function handleEdit() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(user.email.toLowerCase())) {
      globalActions.setUser(user);
      db.updateUser(user.id, user).then(history.goBack());
    } else setInvalidEmailAddress(true);
  }

  function getBirthDate(birthDate) {
    var date = new Date(birthDate);
    return (
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    );
  }

  function logoutUser() {
    authService.logout();
    globalActions.setAuthUser(null);
    history.replace("/login");
  }

  return (
    <IonPage>
      <Loader data={user}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <BackButton />
            </IonButtons>
            <IonTitle>Edit Profile</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => handleEdit()}>
                <IonIcon icon={checkmarkOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonAlert
            isOpen={showInvalidEmailAddress}
            onDidDismiss={() => setInvalidEmailAddress(false)}
            header={"Greška!"}
            message={user.email + " nije ispravna email adresa!"}
            buttons={["OK"]}
          />
          <div
            className="profile-cover"
            style={{
              background: `linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url("https://picsum.photos/seed/${user.email}/500/300")`,
            }}
          ></div>
          <IonGrid class="profile-margin">
            <IonRow class="ion-align-items-center">
              <IonCol size="2" offset="4">
                <IonAvatar className="profile-avatar">
                  <IonImg src={user.pictureLink} alt="Avatar" />
                </IonAvatar>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center">
                <IonButton fill="clear" color="primary">
                  Promijeni sliku profila
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonList className="ion-no-margin ion-no-padding">
            <IonItem>
              <IonLabel position="stacked">Ime</IonLabel>
              <IonInput
                value={user.name}
                onIonChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Prezime</IonLabel>
              <IonInput
                value={user.surname}
                onIonChange={(e) =>
                  setUser({ ...user, surname: e.target.value })
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Bio</IonLabel>
              <IonTextarea
                value={user.bio}
                rows="3"
                onIonChange={(e) => setUser({ ...user, bio: e.target.value })}
              />
            </IonItem>

            <IonRow className="editSkills">
              <IonCol className="ion-text-center">
                {skills.map((skill) => (
                  <IonChip>
                    <IonLabel>{skillList[skill]}</IonLabel>
                  </IonChip>
                ))}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center">
                <IonButton
                  fill="clear"
                  color="primary"
                  onClick={() => history.push("/profile/edit/skills")}
                >
                  Uredi vještine
                </IonButton>
              </IonCol>
            </IonRow>

            <IonItemDivider />

            <IonItem>
              <IonLabel position="stacked">E-mail</IonLabel>
              <IonInput
                type="email"
                value={user.email}
                onIonChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Datum rođenja</IonLabel>
              <IonDatetime
                monthShortNames="siječnja, veljače, ožujka, travnja, svibnja, lipnja, srpnja, kolovoza, rujna, listopada, studenog, prosinca"
                display-format="DD. MMM YYYY."
                picker-format="DD. MMM YYYY."
                max={new Date().toISOString()}
                value={getBirthDate(user.birthDate)}
                onIonChange={(e) =>
                  setUser({
                    ...user,
                    birthDate: new Date(
                      e.target.value.replace(/-/g, "/").replace("T", " ")
                    ).toISOString(),
                  })
                }
              ></IonDatetime>
            </IonItem>
            <IonGrid>
              <IonRow>
                <IonButton
                  fill="clear"
                  color="primary"
                  onClick={() => history.push("/profile/edit/password")}
                >
                  Promijeni password
                </IonButton>
              </IonRow>
              <IonRow>
                <IonButton fill="clear" color="primary" onClick={logoutUser}>
                  Logout
                </IonButton>
              </IonRow>
            </IonGrid>
          </IonList>
        </IonContent>
      </Loader>
    </IonPage>
  );
};

export default withRouter(ProfileEdit);
