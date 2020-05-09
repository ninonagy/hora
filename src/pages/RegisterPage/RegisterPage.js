import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonButton,
  IonCard,
  IonInput,
  IonRow,
  IonCol,
} from "@ionic/react";
import { withRouter, Redirect } from "react-router";

import "../LoginPage.css";

const RegisterPage = (props) => {
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
        <h2 className="heading2">hip hip</h2>
        <h1 className="heading">HORA</h1>
        <IonCard className="login-card">
          <IonInput className="login-input" placeholder="ime"></IonInput>
          <IonInput className="login-input" placeholder="prezime"></IonInput>

          <IonInput
            className="login-input"
            inputMode="email"
            placeholder="e-mail"
          ></IonInput>

          <IonInput
            className="login-input"
            placeholder="password"
            type="password"
          ></IonInput>

          <IonInput
            className="login-input"
            placeholder="ponovi password"
            type="password"
          ></IonInput>

          <IonButton
            fill="clear"
            color="dark"
            className="login-button"
            expand="block"
            onClick={() => props.history.push("/register/2")}
          >
            REGISTRACIJA
          </IonButton>
        </IonCard>
        <IonButton
          fill="clear"
          color="dark"
          className="login-button"
          expand="block"
          onClick={() => props.history.push("/login")}
        >
          ili se prijavi
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(RegisterPage);
