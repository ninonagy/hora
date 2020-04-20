import React from 'react';
import {
  IonText,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButton
} from '@ionic/react';
import { withRouter } from 'react-router';

import useGlobalState from '../state';

const LoginPage = props => {
  const [s, a] = useGlobalState();
  const { history } = props;

  function handleLogin() {
    a.setAuthUser('1'); // demo
    history.push('/');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login / Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <Ion-Content>
        <IonButton onClick={handleLogin}>Click on me to Login</IonButton>
      </Ion-Content>
    </IonPage>
  );
};

export default withRouter(LoginPage);
