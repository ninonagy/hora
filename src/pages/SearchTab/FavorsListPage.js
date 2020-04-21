import React from 'react';
import { withRouter } from 'react-router';

import {
  IonIcon,
  IonText,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCard,
  IonAvatar,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton
} from '@ionic/react';

import { starOutline, star, starHalf } from 'ionicons/icons';

const FavorsListPage = ({ match }) => {
  return (
    <IonPage>
      <IonContent fullscreen="true">
        <IonToolbar>
          <IonTitle slot="start">HORA</IonTitle>
        </IonToolbar>

        {['1', '2', '3'].map(id => 
          <IonCard key={id}>
            <IonItem>
              <IonAvatar slot="start">
                <img src="https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340" />
              </IonAvatar>
              <IonLabel>John Malkovich</IonLabel>
              <IonBadge color="warning">
                <IonIcon icon={star} />
                <IonIcon icon={star} />
                <IonIcon icon={star} />
                <IonIcon icon={starHalf} />
                <IonIcon icon={starOutline} />
              </IonBadge>
            </IonItem>

            <IonCardHeader>
              <IonCardTitle>--Title of the Ad--</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              -- Text of the Ad --
              <IonButton
                color="dark"
                expand="block"
                routerLink={`${match.url}/favor/${id}`}
              >
                See more
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default withRouter(FavorsListPage);
