import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonButton,
  IonRow,
  IonCol,
  IonBadge,
} from "@ionic/react";
import { withRouter, Redirect } from "react-router";

import "../LoginPage.css";

const Register2 = (props) => {
  return (
    <IonPage>
      <IonHeader>
        <IonRow>
          <IonCol className="col1"></IonCol>
          <IonCol className="col2"></IonCol>
          <IonCol className="col3"></IonCol>
          <IonCol className="col4"></IonCol>
        </IonRow>
      </IonHeader>
      <IonContent>
        <h2 className="description">a kako ti možeš pomoći drugima? (:</h2>
        <IonRow className="ion-justify-content-center">
          <IonBadge className="category"> Thing </IonBadge>
          <IonBadge className="category"> Thisisother </IonBadge>
          <IonBadge className="category"> AlsoThing </IonBadge>
          <IonBadge className="category"> SuperThing </IonBadge>
          <IonBadge className="category"> OhThisTHing </IonBadge>
          <IonBadge className="category"> YeahTHing </IonBadge>
          <IonBadge className="category"> CoolSuper </IonBadge>
          <IonBadge className="category"> yasss </IonBadge>
          <IonBadge className="category"> ofcourse </IonBadge>
          <IonBadge className="category"> Thisthing </IonBadge>
          <IonBadge className="category"> alsothis </IonBadge>

          <IonButton
            fill="clear"
            color="dark"
            className="login-button"
            onClick={() => props.history.push("/register")}
          >
            natrag
          </IonButton>

          <IonButton
            fill="clear"
            color="dark"
            className="login-button"
            onClick={() => props.history.push("/register")}
          >
            dalje
          </IonButton>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(Register2);
