import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import {
  IonPage,
  IonContent,
  IonToolbar,
  IonTitle,
  IonList,
} from "@ionic/react";

import FavorCard from "../../components/FavorCard";

import * as db from "../../db.js";

const FavorsListPage = ({ match }) => {
  let [favors, setFavors] = useState([]);

  useEffect(() => {
    db.getFavorsList().then((favors) => {
      let list = favors.sort((item1, item2) => {
        let diff = new Date(item1.dateCreated) - new Date(item2.dateCreated);
        return -diff;
      });
      setFavors(list);
    });
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen="true">
        <IonToolbar>
          <IonTitle slot="start">HORA</IonTitle>
        </IonToolbar>

        <IonList>
          {favors.map((item) => (
            <FavorCard
              item={item}
              key={item.id}
              link={`/favor/${item.id}`}
            />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(FavorsListPage);
