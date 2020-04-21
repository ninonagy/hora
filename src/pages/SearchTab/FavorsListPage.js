import React from 'react';
import { withRouter } from 'react-router';
import {
  IonPage,
  IonContent,
  IonToolbar,
  IonTitle,
  IonList
} from '@ionic/react';

import FavorCard from '../../components/FavorCard';

const FavorsListPage = ({ match }) => {
  return (
    <IonPage>
      <IonContent fullscreen="true">
        <IonToolbar>
          <IonTitle slot="start">HORA</IonTitle>
        </IonToolbar>

        {/* 
          TODO: API call for retrieving list of favours
         */}

        <IonList>
          {['1', '2', '3'].map(id => (
            <FavorCard id={id} link={`${match.url}/favor/${id}`} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(FavorsListPage);
