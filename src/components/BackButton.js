import React from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { chevronBackOutline } from "ionicons/icons";
import { withRouter } from "react-router";

const BackButton = (props) => {
  const handleClick = () => {
    props.history.goBack();
  };

  // if (props.history.action === "PUSH") {
  if (!props.match.params.tab) {
    return (
      <IonButton onClick={handleClick}>
        <IonIcon slot="icon-only" icon={chevronBackOutline} />
      </IonButton>
    );
  } else return null;
};

export default withRouter(BackButton);
