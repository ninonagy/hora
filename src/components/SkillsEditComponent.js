import React, { useEffect, useState } from "react";

import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
} from "@ionic/react";

const SkillsEdit = ({ onChange, skills }) => {
  function changeArray(skill) {
    if (skills.includes(skill)) {
      const index = skills.indexOf(skill);
      skills.splice(index, 1);
    } else skills.push(skill);

    onChange(skills);
  }

  return (
    <IonList>
      <IonItem>
        <IonLabel>Trčanje</IonLabel>
        <IonCheckbox
          slot="start"
          checked={skills.includes("Trčanje")}
          onIonChange={(e) => changeArray("Trčanje")}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Vrtlarenje</IonLabel>
        <IonCheckbox
          slot="start"
          checked={skills.includes("Vrtlarenje")}
          onIonChange={(e) => changeArray("Vrtlarenje")}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Šetanje</IonLabel>
        <IonCheckbox
          slot="start"
          checked={skills.includes("Šetanje")}
          onIonChange={(e) => changeArray("Šetanje")}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Pjevanje</IonLabel>
        <IonCheckbox
          slot="start"
          checked={skills.includes("Pjevanje")}
          onIonChange={(e) => changeArray("Pjevanje")}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Druženje</IonLabel>
        <IonCheckbox
          slot="start"
          checked={skills.includes("Druženje")}
          onIonChange={(e) => changeArray("Druženje")}
        />
      </IonItem>
    </IonList>
  );
};

export default SkillsEdit;
