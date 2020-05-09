import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import {
  IonPage,
  IonContent,
  IonToolbar,
  IonTitle,
  IonList,
  IonIcon,
} from "@ionic/react";

import { earthOutline } from "ionicons/icons";

import "./FavorListPage.css";

import FavorCard from "../../components/FavorCard";

import Loader from "../../components/Loader";

import * as db from "../../db.js";
import { fs } from "../../firebase";
import { buildPath, paths } from "../../scheme";
import { arrayWithId } from "../../utils";

const FavorsListPage = ({ match }) => {
  let [favors, setFavors] = useState([]);

  useEffect(() => {
    fs.collection(buildPath(paths.favor, { favorId: "" }))
      .where("state", "==", "free")
      .orderBy("dateCreated", "desc")
      .get()
      .then((result) => {
        setFavors(arrayWithId(result));
      });
    // db.getFavorsList().then((favors) => {
    //   let list = favors.sort((item1, item2) => {
    //     let diff = new Date(item1.dateCreated) - new Date(item2.dateCreated);
    //     return -diff;
    //   });
    //   setFavors(list);
    // });
  }, []);

  return (
    <IonPage>
      <Loader data={favors}>
        <IonContent fullscreen="true">
          <IonToolbar>
            <IonTitle slot="start">HORA</IonTitle>
          </IonToolbar>
          <h2 className="sectionHeading">Help someone!</h2>
          <IonList>
            {favors.map((item) => (
              <FavorCard item={item} key={item.id} link={`/favor/${item.id}`} />
            ))}
          </IonList>
        </IonContent>
      </Loader>
    </IonPage>
  );
};

export default withRouter(FavorsListPage);
