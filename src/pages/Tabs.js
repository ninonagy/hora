import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonRouterOutlet,
  IonBadge,
} from "@ionic/react";

import ProtectedRoute from "../components/ProtectedRoute";

import GivePage from "./GivePage";
import MessagesPage from "./MessagesTab/MessagesPage";
import ProfilePage from "./ProfilePage";

import FavorsList from "./SearchTab/FavorsListPage";
import ProfileEdit from "./ProfileEdit";
import ProfileEditPassword from "./ProfileEditPassword";
import ProfileEditSkills from "./ProfileEditSkills";

import {
  homeOutline,
  addCircleOutline,
  chatbubblesOutline,
  personOutline,
  filter,
} from "ionicons/icons";

import { fs } from "../firebase";
import { buildPath, paths } from "../scheme";
import useGlobal from "../state";

const Tabs = (props) => {
  const [globalState, globalActions] = useGlobal();
  let [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Listen for new changes in user conversations
    const unsubscribe = fs
      .collection(`/users/${globalState.userId}/conversations`)
      .onSnapshot((querySnapshot) => {
        let unseens = querySnapshot.docs.filter(
          (doc) => doc.data().seen === false
        );
        setNotificationCount(unseens.length);
      });

    // Remove listener when page is not active anymore
    return () => unsubscribe();
  }, []);

  return (
    <IonTabs>
      <IonRouterOutlet>
        {/* Tabs (same as pages except they are navigated as tabs) */}
        <ProtectedRoute exact path="/:tab(search)" component={FavorsList} />
        <ProtectedRoute exact path="/:tab(give)" component={GivePage} />
        <ProtectedRoute
          exact
          path="/:tab(messages)"
          component={MessagesPage}
          reload={notificationCount}
        />
        <ProtectedRoute exact path="/:tab(profile)" component={ProfilePage} />

        <ProtectedRoute exact path="/profile/edit" component={ProfileEdit} />
        <ProtectedRoute
          exact
          path="/profile/edit/password"
          component={ProfileEditPassword}
        />
        <ProtectedRoute
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
          {notificationCount > 0 && <IonBadge>{notificationCount}</IonBadge>}
        </IonTabButton>

        <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={personOutline} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
