import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonPage,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonRouterOutlet,
} from "@ionic/react";

import ProtectedRoute from "../components/ProtectedRoute";

import ConversationPage from "./MessagesTab/ConversationPage";
import PublicProfilePage from "./PublicProfilePage";

import GivePage from "./GivePage";
import MessagesPage from "./MessagesTab/MessagesPage";
import ProfilePage from "./ProfilePage";

import FavorsList from "./SearchTab/FavorsListPage";
import FavorDetail from "./SearchTab/FavorDetailPage";
import ProfileEdit from "./ProfileEdit";
import ProfileEditPassword from "./ProfileEditPassword";
import ProfileEditSkills from "./ProfileEditSkills";

import {
  homeOutline,
  addCircleOutline,
  chatbubblesOutline,
  personOutline,
} from "ionicons/icons";

const Tabs = (props) => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        {/* Tabs (same as pages except they are navigated as tabs) */}
        <ProtectedRoute exact path="/:tab(search)" component={FavorsList} />
        <ProtectedRoute exact path="/:tab(give)" component={GivePage} />
        <ProtectedRoute exact path="/:tab(messages)" component={MessagesPage} />
        <ProtectedRoute exact path="/:tab(profile)" component={ProfilePage} />

        <Route exact path="/profile/edit" component={ProfileEdit} />
        <Route
          exact
          path="/profile/edit/password"
          component={ProfileEditPassword}
        />
        <Route
          exact
          path="/profile/edit/skills"
          component={ProfileEditSkills}
        />

        <Redirect exact from="/home" to="/search" />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="search" href="/search">
          <IonIcon icon={homeOutline} />
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
  );
};

export default Tabs;
