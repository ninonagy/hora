import React from "react";

import { IonList, IonItem, IonLabel, IonCheckbox } from "@ionic/react";

const SkillsEdit = ({ skillsList, userSkills, onChange }) => {
  function removeOrAddSkill(id) {
    if (userSkills.includes(id)) {
      // remove user's skill
      const index = userSkills.indexOf(id);
      userSkills.splice(index, 1);
    } else {
      // add skill
      userSkills.push(id);
    }
    onChange(userSkills);
  }

  return (
    <IonList>
      {Object.entries(skillsList).map(([id, skill]) => (
        <IonItem>
          <IonLabel>{skill}</IonLabel>
          <IonCheckbox
            slot="start"
            checked={userSkills.includes(id)}
            onIonChange={() => removeOrAddSkill(id)}
          />
        </IonItem>
      ))}
    </IonList>
  );
};

export default SkillsEdit;
