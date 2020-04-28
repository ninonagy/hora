import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import useGlobalState from "./state";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

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

import * as db from "./db";

const SplashScreen = () => {
  // render some nice picture
  return <div></div>;
};

const App = () => {
  const [globalState, globalActions] = useGlobalState();

  // let assetsLoaded = false;
  // TODO: Load assets (fonts, localization, images)

  // TODO
  // lookup if user auth code is stored in app data
  // or try to authenticate user through login-signup form

  // db.getFavor("f4").then(favor => console.log(favor));

  // db.getUser("u1").then(user => console.log(user));

  let isUserAuthed = globalState.userId !== undefined;

  return (
    <IonApp>
      <IonReactRouter>
        <Route
          path="/"
          render={(props) => {
            return isUserAuthed ? <HomePage {...props} /> : <LoginPage />;
          }}
        />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
