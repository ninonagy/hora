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
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";

import { chevronDownCircleOutline } from "ionicons/icons";

import "./FavorListPage.css";

import FavorCard from "../../components/FavorCard";

import AdCard from "../../components/AdCard";

import Loader from "../../components/Loader";

import * as db from "../../db";

import { fs } from "../../firebase";
import { buildPath, paths, states } from "../../scheme";
import { arrayWithId } from "../../utils";
import useGlobal from "../../state";
import useCache from "../../hooks/useCache";

const FavorsListPage = (props) => {
  const [globalState, {}] = useGlobal();
  const skillList = useCache(db.getSkillsList, `/skills`);
  let [favorsFree, setFavorsFree] = useState([]);
  let [userFavorsActive, setUserFavorsActive] = useState([]);
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updateFavorList();
  }, []);

  async function updateFavorList() {
    // Get free favors filtered by user skills
    setFavorsFree(
      arrayWithId(
        await fs
          .collection(buildPath(paths.favor, { favorId: "" }))
          .where("state", "==", states.favor.free)
          .where("skills", "array-contains-any", globalState.user.skills)
          .get()
      )
    );

    // Get user's active favors
    setUserFavorsActive(
      arrayWithId(
        await fs
          .collection(
            buildPath(paths.favor, {
              userId: globalState.userId,
              favorId: "",
            })
          )
          .where("userId", "==", globalState.userId)
          .where("state", "==", states.favor.active)
          .orderBy("dateCreated", "desc")
          .get()
      )
    );

    setIsLoading(false);
  }

  async function handleRefresh(event) {
    await updateFavorList();
    event.target.complete();
  }

  function showUserActiveFavors() {
    if (userFavorsActive.length)
      return (
        <>
          <span className="sectionHeading">Tvoje usluge u tijeku</span>
          <IonList>
            {userFavorsActive.map((item) => (
              <FavorCard
                skillList={skillList.all}
                item={item}
                key={item.id}
                link={`/favor/${item.id}`}
              />
            ))}
          </IonList>
        </>
      );
  }

  function showFreeFavors() {
    return (
      <>
        <span className="sectionHeading">Pomogni nekome</span>
        <IonList>
          {favorsFree.map((item) =>
            item.ownerId ? (
              <FavorCard
                skillList={skillList.all}
                item={item}
                key={item.id}
                link={`/favor/${item.id}`}
              />
            ) : (
              <AdCard item={item} key={item.id} />
            )
          )}
        </IonList>
      </>
    );
  }

  return (
    <IonPage>
      <Loader data={!isLoading}>
        <IonContent fullscreen="true">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent
              pullingIcon={chevronDownCircleOutline}
              pullingText="Osvježi"
              refreshingText="Osvježavanje"
              refreshingSpinner="circular"
            />
          </IonRefresher>
          <IonToolbar>
            <IonTitle slot="start">HORA</IonTitle>
          </IonToolbar>
          {showUserActiveFavors()}
          {showFreeFavors()}
        </IonContent>
      </Loader>
    </IonPage>
  );
};

export default withRouter(FavorsListPage);
