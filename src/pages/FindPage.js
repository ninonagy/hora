import React from 'react';
import { IonIcon, IonText, IonContent, IonHeader, IonToolbar, IonTitle, IonPage } from '@ionic/react';
import { withRouter } from "react-router";
import { starOutline, star, starHalf } from 'ionicons/icons';

const FindPage = props => {
  return (
    <IonPage>
      <IonContent fullscreen="true">
        <IonToolbar>
          <IonTitle slot="start">
            HORA
        </IonTitle>
        </IonToolbar>
        <ion-card>
            <ion-item>
                <ion-avatar slot="start">
                    <img src="https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340" />
                </ion-avatar>
                <ion-label>John Malkovich</ion-label>
                <ion-badge color="warning">
                    <IonIcon icon={star} />
                    <IonIcon icon={star} />
                    <IonIcon icon={star} />
                    <IonIcon icon={starHalf} />
                    <IonIcon icon={starOutline} />
                </ion-badge>
            </ion-item>

            <ion-card-header>
                <ion-card-title>--Title of the Ad--</ion-card-title>
            </ion-card-header>

            <ion-card-content>
                -- Text of the Ad --
            <ion-button color="dark" expand="block">see more</ion-button>
            </ion-card-content>
        </ion-card>
      </IonContent>
    </IonPage>
  );
}

export default withRouter(FindPage);