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
  IonItemDivider,
  IonTextarea,
  IonButton,
  IonRange,
  IonDatetime,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonAlert,
  IonFooter,
  IonImg,
  IonGrid,
  IonIcon,
  IonButtons,
} from "@ionic/react";

import { withRouter } from "react-router";

import "./GivePage.css";

import * as db from "../db";
import useGlobal from "../state";
import { closeCircle, camera, cameraOutline } from "ionicons/icons";
import useCache from "../hooks/useCache";
import takePicture from "../services/camera";
import { fs } from "../firebase";

const getFavorIdeas = () => {
  return fs.doc("/lists/favorIdeas").get();
};

const GivePage = (props) => {
  const [globalState, globalActions] = useGlobal();
  // let [skillList, setSkillList] = useState({});
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [dateTime, setDateTime] = useState(new Date());
  // let [timeEstimation, setTimeEstimation] = useState(30);
  let [selectedSkills, setSelectedSkills] = useState();
  let [photo, setPhoto] = useState(null);
  let [titleTemplate, setTitleTemplate] = useState("");
  let [descriptionTemplate, setDescriptionTemplate] = useState("");

  const [showAllFieldsRequired, setAllFieldsRequired] = useState(false);

  let user = useCache(() => db.getUser(globalState.userId), `user`);

  let skillList = useCache(db.getSkillsList, `/skills`, true);
  let favorIdeas = useCache(getFavorIdeas, `/favorIdeas`, true);

  let timeAvailable = user.timeEarned - user.timeSpent;

  useEffect(() => {
    // Get some input ideas
    if (favorIdeas?.all) {
      const rand = (max) => {
        return Math.floor(Math.random() * max);
      };
      var index = rand(Object.keys(favorIdeas.all).length);
      setTitleTemplate(favorIdeas.all[index][0]);
      setDescriptionTemplate(favorIdeas.all[index][1]);
    }
  }, [favorIdeas]);

  async function handlePhoto() {
    let image = await takePicture();
    setPhoto(image);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let userId = globalState.userId;
    let { location } = globalState.user;

    if (title && description && location && selectedSkills && dateTime) {
      let favorId = await db.createFavor({
        ownerId: userId,
        title: title,
        description: description,
        location: location,
        skills: selectedSkills,
        dateDue: dateTime.toISOString(),
      });

      // Store photo
      let picUrl = await db.storeFavorPicture(
        favorId,
        photo.data,
        photo.format
      );

      // Update picture url field
      db.updateFavor(favorId, {
        picUrl,
      });

      // Forward user to the public favor page
      props.history.replace(`/favor/${favorId}`);
    } else setAllFieldsRequired(true);
  }

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
            isOpen={showAllFieldsRequired}
            onDidDismiss={() => setAllFieldsRequired(false)}
            header={"Greška!"}
            message={"Sva polja su obavezna!"}
            buttons={["U redu"]}
          />
          <IonList className="ion-no-margin ion-no-padding" lines="none">
            {/* Upload photo */}
            <div className="image-container">
              <IonImg
                style={{ width: "100%" }}
                src={photo?.data || `https://picsum.photos/500/250?blur=10`}
              />
              <IonButton className="button" color="dark" onClick={handlePhoto}>
                <IonIcon icon={cameraOutline} />
                <span className="add-photo">Dodaj fotografiju</span>
              </IonButton>
            </div>

            <IonItem>
              <IonInput
                className="title-input"
                placeholder={titleTemplate}
                style={{ lineHeight: 1.7 }}
                onIonChange={(e) => setTitle(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <IonTextarea
                className="description-input"
                placeholder={descriptionTemplate}
                rows="5"
                onIonChange={(e) => setDescription(e.target.value)}
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
                value={
                  dateTime.getFullYear() +
                  "-" +
                  (dateTime.getMonth() + 1) +
                  "-" +
                  dateTime.getDate()
                }
                onIonChange={(e) =>
                  setDateTime(
                    new Date(
                      e.target.value.replace(/-/g, "/").replace("T", " ")
                    )
                  )
                }
                style={{ lineHeight: 1.7 }}
              ></IonDatetime>
            </IonItem>
            <IonItem>
              <IonLabel>Potrebne vještine</IonLabel>
              <IonSelect
                multiple={true}
                cancelText="Odustani"
                okText="Odaberi"
                onIonChange={(e) => setSelectedSkills(e.detail.value)}
                style={{ lineHeight: 1.7 }}
              >
                {Object.entries(skillList.all).map(([id, skill]) => (
                  <IonSelectOption value={id}>{skill}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonList>
        </IonContent>
        <IonFooter className="ion-no-border">
          <IonToolbar>
            <IonButton
              type="submit"
              className="bigButton"
              color="dark"
              expand="block"
              fill="outline"
              onClick={handleSubmit}
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
          {
            //using illustration from https://undraw.co/
          }
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
