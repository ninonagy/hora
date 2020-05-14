import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import {
  IonPage,
  IonContent,
  IonToolbar,
  IonTitle,
  IonList,
  IonIcon,
  IonBadge,
} from "@ionic/react";

import { heart } from "ionicons/icons";

import "./FavorListPage.css";

import FavorCard from "../../components/FavorCard";

import Loader from "../../components/Loader";

import { fs } from "../../firebase";
import { buildPath, paths, states } from "../../scheme";
import { arrayWithId } from "../../utils";
import useGlobal from "../../state";

const FavorsListPage = (props) => {
  let [favorsFree, setFavorsFree] = useState([]);
  let [userFavorsActive, setUserFavorsActive] = useState([]);
  const [globalState, {}] = useGlobal();

  useEffect(() => {
    // Get free favors
    fs.collection(buildPath(paths.favor, { favorId: "" }))
      .where("state", "==", states.favor.free)
      .orderBy("dateCreated", "desc")
      .get()
      .then((result) => {
        setFavorsFree(arrayWithId(result));
      });

    // Get user's active favors
    fs.collection(
      buildPath(paths.favor, {
        userId: globalState.userId,
        favorId: "",
      })
    )
      .where("userId", "==", globalState.userId)
      .where("state", "==", states.favor.active)
      .orderBy("dateCreated", "desc")
      .get()
      .then((result) => {
        setUserFavorsActive(arrayWithId(result));
      });
  }, []);

  function showFavors() {
    if (userFavorsActive[0])
      return <span className="sectionHeading">Your active favors</span>;
  }

  return (
    <IonPage>
      <Loader data={favorsFree}>
        <IonContent fullscreen="true">
          <IonToolbar>
            <IonTitle slot="start">HORA</IonTitle>
          </IonToolbar>
          {showFavors()}
          <IonList>
            {userFavorsActive.map((item) => (
              <FavorCard item={item} key={item.id} link={`/favor/${item.id}`} />
            ))}
          </IonList>
          <span className="sectionHeading">Help someone!</span>
          <IonList>
            {favorsFree.map((item) => (
              <FavorCard item={item} key={item.id} link={`/favor/${item.id}`} />
            ))}
          </IonList>
        </IonContent>
      </Loader>
    </IonPage>
  );
};

export default withRouter(FavorsListPage);
