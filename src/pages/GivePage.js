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
} from "@ionic/react";

import { withRouter } from "react-router";

import "./GivePage.css";

import * as db from "../db";
import useGlobal from "../state";
import { closeCircle, camera } from "ionicons/icons";
import useCache from "../hooks/useCache";
import takePicture from "../services/camera";

const GivePage = (props) => {
  const [globalState, globalActions] = useGlobal();
  let [skillList, setSkillList] = useState({});
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [dateTime, setDateTime] = useState(new Date());
  // let [timeEstimation, setTimeEstimation] = useState(30);
  let [selectedSkills, setSelectedSkills] = useState();
  let [photo, setPhoto] = useState(null);

  const [showAllFieldsRequired, setAllFieldsRequired] = useState(false);

  let user = useCache(() => db.getUser(globalState.userId), `user`);

  let timeAvailable = user.timeEarned - user.timeSpent;

  useEffect(() => {
    db.getSkillsList().then((skills) => {
      setSkillList(skills.all);
    });
  }, []);

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
            <IonTitle>Objavi uslugu</IonTitle>
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
          <IonList className="ion-no-margin ion-no-padding">
            <IonItem>
              <IonLabel position="floating">Naslov</IonLabel>
              <IonInput onIonChange={(e) => setTitle(e.target.value)} />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Opis</IonLabel>
              <IonTextarea
                rows="5"
                onIonChange={(e) => setDescription(e.target.value)}
              />
            </IonItem>

            {/* <IonItem>
              <IonLabel>Oznake</IonLabel>
              <IonInput>
                <IonChip>
                  <IonIcon icon={closeCircle} />
                  <IonLabel>primjer 1</IonLabel>
                </IonChip>

                <IonChip>
                  <IonIcon icon={closeCircle} />
                  <IonLabel>primjer 2</IonLabel>
                </IonChip>
              </IonInput>
            </IonItem> */}

            <IonItemDivider />

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
              ></IonDatetime>
            </IonItem>
            <IonItem>
              <IonLabel>Potrebne vještine</IonLabel>
              <IonSelect
                multiple={true}
                cancelText="Odustani"
                okText="Odaberi"
                onIonChange={(e) => setSelectedSkills(e.detail.value)}
              >
                {Object.entries(skillList).map(([id, skill]) => (
                  <IonSelectOption value={id}>{skill}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            {/* <IonItem>
              <IonLabel>Vrijeme</IonLabel>
              <IonDatetime
                required
                display-format="HH:mm"
                picker-format="HH:mm"
                value={dateTime.getHours() + ":" + dateTime.getMinutes()}
                // onIonChange={e => setTime(e.target.value)}
              />
            </IonItem> 

            <IonItem>
              <IonLabel>Procijenjeno vrijeme</IonLabel>
              <IonRange
                value={timeEstimation}
                onIonChange={(e) => setTimeEstimation(e.target.value)}
                min={15}
                max={60}
                step={5}
                snaps={true}
                ticks={false}
                pin={true}
                color="secondary"
              />
            </IonItem>
*/}
            <IonItemDivider />

            {/* Upload photo */}
            <IonGrid className="image-container" onClick={handlePhoto}>
              <IonImg
                style={{ opacity: 0.2, width: "100%" }}
                src={
                  photo?.data ||
                  `https://picsum.photos/id/${timeAvailable}/500/300`
                }
              />
              <IonIcon className="btn" size="50" icon={camera}>
                Učitaj fotografiju
              </IonIcon>
            </IonGrid>
          </IonList>
        </IonContent>
        <IonFooter className="ion-no-border">
          <IonToolbar>
            <IonButton expand="block" fill="outline" onClick={handleSubmit}>
              Objavi
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
            <IonTitle>Objavi uslugu</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          {
            //using illustration from https://undraw.co/
          }
          <img className="image" src="../assets/sad.svg" />
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
