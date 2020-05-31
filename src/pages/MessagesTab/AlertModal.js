import React from "react";
import { IonAlert } from "@ionic/react";

import { useStore } from "../GiveTab/model";

const AlertModal = () => {
  const [state, actions] = useStore("Conversation");

  return (
    <IonAlert
      isOpen={state.alertModal.isOpen}
      onDidDismiss={actions.closeAlertModal}
      header={state.alertModal.headerText}
      message={state.alertModal.messageText}
      buttons={[
        {
          text: state.alertModal.cancelButtonText,
          role: "cancel",
          cssClass: "secondary",
          handler: () => {},
        },
        {
          text: state.alertModal.acceptButtonText,
          handler: () => {
            actions.handleModalAccept();
          },
        },
      ]}
    />
  );
};

export default AlertModal;
