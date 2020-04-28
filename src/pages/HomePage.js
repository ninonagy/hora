import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonContent,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonRouterOutlet,
} from "@ionic/react";

import SearchTab from "./SearchTab";
import GivePage from "./GivePage";
import MessagesPage from "./MessagesTab/MessagesPage";
import ConversationPage from "./MessagesTab/ConversationPage";
import ProfilePage from "./ProfilePage";

import {
  searchOutline,
  addCircleOutline,
  chatbubblesOutline,
  personOutline,
} from "ionicons/icons";

const Home = (props) => {
  return (
    <IonContent>
      <IonTabs>
        <IonRouterOutlet>
          {/* Tabs (same as pages except they are navigated as tabs) */}
          <Route path="/:tab(search)" component={SearchTab} />
          <Route path="/:tab(give)" component={GivePage} />
          <Route path="/:tab(messages)" component={MessagesPage} />
          <Route path="/:tab(profile)" component={ProfilePage} />
          <Route exact path="/" render={() => <Redirect to="/search" />} />
          {/* Other routes */}
          <Route path="/messages/conversation" component={ConversationPage} />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="search" href="/search">
            <IonIcon icon={searchOutline} />
          </IonTabButton>

          <IonTabButton tab="give" href="/give">
            <IonIcon icon={addCircleOutline} />
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
