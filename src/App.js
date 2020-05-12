import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { IonReactRouter } from "@ionic/react-router";

import { IonApp, IonPage } from "@ionic/react";

import useGlobalState from "./state";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import RegisterPage2 from "./pages/RegisterPage/Register2";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* Global css */
import "./pages/hora.css";

import ConversationPage from "./pages/MessagesTab/ConversationPage";
import FavorDetail from "./pages/SearchTab/FavorDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicProfilePage from "./pages/PublicProfilePage";
import ProfileEdit from "./pages/ProfileEdit";

import Tabs from "./pages/Tabs";

const SplashScreen = () => {
  // render some nice picture
  return <IonPage>Loading...</IonPage>;
};

const App = () => {
  // let assetsLoaded = false;
  // TODO: Load assets (fonts, localization, images)

  return (
    <IonApp>
      <IonReactRouter>
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/register/2" component={RegisterPage2} />
          <Route exact path="/profile/edit" component={ProfileEdit} />

          {/* Other routes */}
          {/* Favor detail */}
          <Route path="/favor/:favorId" component={FavorDetail} />
          {/* Public profile */}
          <Route
            path="/user/:userId"
            render={(props) => <PublicProfilePage {...props} />}
          />
          {/* Conversation page */}
          <ProtectedRoute
            path="/messages/conversation/:conversationId"
            component={ConversationPage}
          />
          <Tabs />
        </Switch>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
