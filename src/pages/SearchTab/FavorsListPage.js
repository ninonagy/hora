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

const FavorsListPage = (props) => {
  let [favorsFree, setFavorsFree] = useState([]);
  let [userFavorsActive, setUserFavorsActive] = useState([]);
  let [skillList, setSkillList] = useState({});
  const [globalState, {}] = useGlobal();

  useEffect(() => {
    updateFavorList();
  }, []);

  useEffect(() => {
    db.getSkillsList().then((skills) => {
      setSkillList(skills.all);
    });
  }, []);

  async function updateFavorList() {
    // Get free favors
    setFavorsFree(
      arrayWithId(
        await fs
          .collection(buildPath(paths.favor, { favorId: "" }))
          .where("state", "==", states.favor.free)
          .orderBy("dateCreated", "desc")
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
  }

  async function handleRefresh(event) {
    await updateFavorList();
    event.target.complete();
  }

  function showUserActiveFavors() {
    if (userFavorsActive.length)
      return (
        <>
          <span className="sectionHeading">Your active favors</span>
          <IonList>
            {userFavorsActive.map((item) => (
              <FavorCard
                skillList={skillList}
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
        <span className="sectionHeading">Help someone!</span>
        <IonList>
          {favorsFree.map((item) =>
            item.ownerId ? (
              <FavorCard
                skillList={skillList}
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
      <Loader data={favorsFree}>
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
