import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButtons,
  IonIcon,
  IonButton,
  IonPopover,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert,
  IonChip,
  IonLabel,
  IonFooter,
  IonTextarea,
  IonItem,
} from "@ionic/react";

import { star, starOutline } from "ionicons/icons";

import "./ReviewPage.css";

import { withRouter } from "react-router";

import ProfileCard from "../../components/Cards/ProfileCard";

import BackButton from "../../components/Buttons/Back";
import Loader from "../../components/shared/Loader";

import * as db from "../../db";
import useGlobal from "../../state";

import useCache from "../../hooks/useCache";

const ReviewPage = ({ history, match }) => {
  const [globalState, globalActions] = useGlobal();

  const favorId = match.params.favorId;
  let favor = useCache(() => db.getFavor(favorId), `/favor/${favorId}`);

  let [user, setUser] = useState({});

  let [rating, setRating] = useState(0);

  useEffect(() => {
    if (favor) {
      db.getUser(favor.ownerId).then((user) => {
        setUser(user);
      });
    }
  }, [favor]);

  let { title, description } = favor;

  function showStars(rating) {
    return [...Array(5)].map((e, i) =>
      i < rating ? (
        <IonButton fill="clear" color="dark" onClick={() => setRating(i + 1)}>
          <IonIcon icon={star} />
        </IonButton>
      ) : (
        <IonButton fill="clear" color="dark" onClick={() => setRating(i + 1)}>
          <IonIcon icon={starOutline} />
        </IonButton>
      )
    );
  }

  function showStarsDescription(rating) {
    var description;
    switch (rating) {
      case 1:
        description = "Užasno";
        break;
      case 2:
        description = "Loše";
        break;
      case 3:
        description = "Ispod očekivanja";
        break;
      case 4:
        description = "Očekivano";
        break;
      case 5:
        description = "Iznad očekivanja";
    }
    return description;
  }

  return (
    <IonPage>
      <Loader data={favor && user}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <BackButton />
            </IonButtons>
            <IonButtons slot="end"></IonButtons>
            <IonTitle>Ocjena</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <ProfileCard user={user} userId={favor.ownerId} />

          <IonGrid>
            <IonRow class="ion-justify-content-center">
              {showStars(rating)}
            </IonRow>
            <IonRow class="ion-justify-content-center">
              <span className="stars-description">
                {showStarsDescription(rating)}
              </span>
            </IonRow>
            <IonRow>
              <IonTextarea
                className="rating-comment"
                placeholder="Dodaj komentar..."
                autoGrow="true"
                style={{ lineHeight: 1.7 }}
              />
            </IonRow>
          </IonGrid>
        </IonContent>
        <IonFooter className="ion-no-border">
          <IonToolbar>
            <IonButton
              className="bigButton"
              color="dark"
              expand="block"
              fill="outline"
              shape="round"
            >
              Ocjeni
            </IonButton>
          </IonToolbar>
        </IonFooter>
      </Loader>
    </IonPage>
  );
};

export default withRouter(ReviewPage);
