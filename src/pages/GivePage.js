import React, { useState } from "react";
import {
  IonText,
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
  IonButtons,
  IonIcon,
  IonRange,
  IonDatetime,
  IonChip,
  IonThumbnail,
} from "@ionic/react";

import { withRouter } from "react-router";

import { closeCircle } from "ionicons/icons";

const dateTime = new Date();

const GivePage = (props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Give</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList class="ion-no-margin ion-no-padding">
          <IonItem>
            <IonLabel position="floating">Naslov</IonLabel>
            <IonInput></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Opis</IonLabel>
            <IonTextarea rows="5"></IonTextarea>
          </IonItem>

          <IonItem>
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
          </IonItem>

          <IonItemDivider></IonItemDivider>

          <ion-item>
            <IonLabel>Datum</IonLabel>
            <IonDatetime
              monthShortNames="siječnja, veljače, ožujka, travnja, svibnja, lipnja, srpnja, kolovoza, rujna, listopada, studenog, prosinca"
              display-format="DD. MMM YYYY."
              picker-format="DD. MMM YYYY."
              value={
                dateTime.getFullYear() +
                "-" +
                (dateTime.getMonth() + 1) +
                "-" +
                dateTime.getDate()
              }
            ></IonDatetime>
          </ion-item>

          <IonItem>
            <IonLabel>Vrijeme</IonLabel>
            <IonDatetime
              display-format="HH:mm"
              picker-format="HH:mm"
              value={dateTime.getHours() + ":" + dateTime.getMinutes()}
            ></IonDatetime>
          </IonItem>

          <IonItem>
            <IonLabel>Procijenjeno vrijeme</IonLabel>
            <IonRange
              value={15}
              min={0}
              max={60}
              step={5}
              snaps={true}
              ticks={false}
              pin={true}
              color="secondary"
            />
          </IonItem>

          <IonItemDivider></IonItemDivider>

          <IonButton expand="block" fill="outline">
            potvrdi
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(GivePage);
