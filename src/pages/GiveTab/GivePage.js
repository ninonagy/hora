import React, { useState, useEffect } from "react";

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonPage,
  IonTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
  IonButton,
  IonDatetime,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonAlert,
  IonFooter,
  IonImg,
  IonIcon,
} from "@ionic/react";

import { withRouter } from "react-router";

import "./GivePage.css";

import useGlobal from "../../state";
import { cameraOutline } from "ionicons/icons";
import useCache from "../../hooks/useCache";
import { useStore, subscribe, getState } from "./model";
import * as db from "../../db";
import { fs } from "../../firebase";

const getFavorIdeas = () => {
  return fs.doc("/lists/favorIdeas").get();
};

const getISODate = (date) => {
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
};

const getRandMax = (max) => {
  return Math.floor(Math.random() * max);
};

const GivePage = (props) => {
  const [globalState] = useGlobal();
  const [state, actions] = useStore("Inputs");

  let user = useCache(() => db.getUser(globalState.userId), `user`);

  let skillList = useCache(db.getSkillsList, `/skills`, true);
  let favorIdeas = useCache(getFavorIdeas, `/favorIdeas`, true);

  let timeAvailable = user.timeEarned - user.timeSpent;

  useEffect(() => {
    // Set some random placeholders ideas for title and description fields
    if (favorIdeas?.all) {
      var length = Object.keys(favorIdeas.all).length;
      var index = getRandMax(length);
      actions.setPlaceholders({
        title: favorIdeas.all[index][0],
        description: favorIdeas.all[index][1],
      });
    }
  }, [favorIdeas]);

  const publishFavor = async () => {
    await actions.createFavor(globalState.user);
  };

  // Redirect when favor is published
  subscribe("Inputs", "createFavor", () => {
    const { favorId } = getState("Inputs");
    // Forward user to the public favor page
    props.history.replace(`/favor/${favorId}`);
  });

  if (timeAvailable > 0)
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Zatraži uslugu</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonAlert
            isOpen={state.showAllFieldsRequired}
            onDidDismiss={() => actions.setShowAllFieldsRequired(false)}
            header={"Greška!"}
            message={"Sva polja su obavezna!"}
            buttons={["U redu"]}
          />
          <IonAlert
            isOpen={state.showOptionalImageAlert}
            onDidDismiss={() => actions.setShowOptionalImageAlert(false)}
            header={"Fotografija"}
            message={"Sigurno ne želiš dodati fotografiju?"}
            buttons={[
              {
                text: "Dodaj fotografiju",
                cssClass: "secondary",
                handler: () => {
                  actions.handlePhoto();
                },
              },
              {
                text: "Objavi bez slike",
                cssClass: "secondary",
                handler: () => {
                  publishFavor();
                },
              },
            ]}
          />
          <IonList className="ion-no-margin ion-no-padding" lines="none">
            {/* Upload photo */}
            <div className="image-container">
              <IonImg
                style={{ width: "100%" }}
                src={
                  state.photo?.data || `https://picsum.photos/500/250?blur=10`
                }
              />
              <IonButton
                className="button"
                color="dark"
                onClick={actions.handlePhoto}
              >
                <IonIcon icon={cameraOutline} />
                <span className="add-photo">Dodaj fotografiju</span>
              </IonButton>
            </div>

            <IonItem>
              <IonInput
                className="title-input"
                placeholder={state.titlePlaceholder}
                style={{ lineHeight: 1.7 }}
                onIonChange={(e) => actions.setTitle(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <IonTextarea
                className="description-input"
                placeholder={state.descriptionPlaceholder}
                rows="5"
                onIonChange={(e) => actions.setDescription(e.target.value)}
                style={{ lineHeight: 1.7 }}
              />
            </IonItem>

            <IonItem>
              <IonLabel>Krajnji rok</IonLabel>
              <IonDatetime
                monthShortNames="siječnja, veljače, ožujka, travnja, svibnja, lipnja, srpnja, kolovoza, rujna, listopada, studenog, prosinca"
                display-format="DD. MMM YYYY."
                picker-format="DD. MMM YYYY."
                min={new Date().toISOString()}
                value={getISODate(state.dateDue)}
                onIonChange={(e) => actions.setDateDue(e.target.value)}
                style={{ lineHeight: 1.7 }}
              ></IonDatetime>
            </IonItem>
            <IonItem>
              <IonLabel>Potrebne vještine</IonLabel>
              <IonSelect
                multiple={true}
                cancelText="Odustani"
                okText="Odaberi"
                onIonChange={(e) => actions.setSkills(e.detail.value)}
                style={{ lineHeight: 1.7 }}
              >
                {Object.entries(skillList.all).map(([id, skill]) => (
                  <IonSelectOption key={id} value={id}>
                    {skill}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonList>
        </IonContent>
        <IonFooter className="ion-no-border">
          <IonToolbar>
            <IonButton
              className="bigButton"
              color="dark"
              expand="block"
              fill="outline"
              onClick={() => actions.validateInputs(publishFavor)}
              shape="round"
            >
              Zatraži
            </IonButton>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  else
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Zatraži uslugu</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          {/* using illustration from https://undraw.co/ */}
          <IonImg className="image" src="../assets/sad.svg" />
          <IonRow>
            <IonCol className="ion-text-center profile-bio">
              Nažalost, nemaš dovoljno novčića kako bi zatražio nove usluge. :(
              <br />
              <br />
              Savjet: pogledaj što se sve skriva na naslovnici, možda možeš
              pomoći nekome i zaraditi novčiće!
            </IonCol>
          </IonRow>
        </IonContent>
      </IonPage>
    );
};

export default withRouter(GivePage);
