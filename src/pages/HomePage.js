import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonContent,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonRouterOutlet
} from '@ionic/react';

import SearchTab from './SearchTab';
import GivePage from './GivePage';
import MessagesPage from './MessagesPage';
import ProfilePage from './ProfilePage';

import {
  searchOutline,
  addCircleOutline,
  chatbubblesOutline,
  personOutline
} from 'ionicons/icons';

const Home = props => {
  return (
    <IonContent>
      <IonTabs>
        <IonRouterOutlet>
          {/* Tabs (same as pages except they are navigated as tabs) */}
          <Route path="/:tab(search)" component={SearchTab} />
          <Route path="/:tab(give)" component={GivePage} />
          <Route path="/:tab(messages)" component={MessagesPage} />
          <Route path="/:tab(profile)" component={ProfilePage} />
          <Route path="/" render={() => <Redirect to="/search" />} />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="find" href="/find">
            <IonIcon icon={searchOutline} />
            {/* <IonLabel>Find</IonLabel> */}
          </IonTabButton>

          <IonTabButton tab="give" href="/give">
            <IonIcon icon={addCircleOutline} />
            {/* <IonLabel>Give</IonLabel> */}
          </IonTabButton>

          <IonTabButton tab="messages" href="/messages">
            <IonIcon icon={chatbubblesOutline} />
          </IonTabButton>

          <IonTabButton tab="profile" href="/profile">
            <IonIcon icon={personOutline} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonContent>
  );
};

export default Home;
