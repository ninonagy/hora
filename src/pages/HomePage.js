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
import PublicProfilePage from "./PublicProfilePage";

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
          <Route exact path="/:tab(search)" component={SearchTab} />
          <Route exact path="/:tab(give)" component={GivePage} />
          <Route exact path="/:tab(messages)" component={MessagesPage} />
          <Route exact path="/:tab(profile)" component={ProfilePage} />
          {/* Other routes */}
          {/* Conversation page */}
          <Route
            path="/messages/conversation/:conversationId"
            component={ConversationPage}
          />
          {/* Public profile */}
          <Route
            path="/profile/public/:userId"
            render={(props) => <PublicProfilePage {...props} />}
          />
          {/* Default route */}
          <Route exact path="/" render={() => <Redirect to="/search" />} />
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
