import React, { useEffect, useState } from "react";

import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
} from "@ionic/react";

const SkillsEdit = ({ onChange, skills, skillList }) => {
  function changeArray(skill) {
    if (skills.includes(skill)) {
      const index = skills.indexOf(skill);
      skills.splice(index, 1);
    } else skills.push(skill);

    onChange(skills);
  }

  return (
    <IonList>
      {Object.entries(skillList).map(([id, skill]) => (
        <IonItem>
          <IonLabel>{skill}</IonLabel>
          <IonCheckbox
            slot="start"
            checked={skills.includes(id)}
            onIonChange={(e) => changeArray(id)}
          />
        </IonItem>
      ))}
    </IonList>
  );
};

export default SkillsEdit;
