import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButton,
  IonGrid,
  IonRow,
  IonAlert,
  IonFooter,
  IonTextarea,
} from "@ionic/react";

import { star, starOutline } from "ionicons/icons";

import "./ReviewPage.css";

import { withRouter } from "react-router";

import ProfileCard from "../../components/Cards/ProfileCard";

import * as db from "../../db";

const ReviewPage = ({
  userReviewing,
  userToReview,
  favor,
  favorId,
  setShowReviewModal,
}) => {
  let [rating, setRating] = useState(0);
  let [comment, setComment] = useState("");

  const [showRatingRequiredAlert, setRatingRequiredAlert] = useState(false);

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

  function handleReview() {
    if (rating != 0) {
      db.setReview(
        userToReview.id,
        userReviewing.id,
        userReviewing.name,
        userReviewing.pictureLink,
        favorId,
        rating,
        comment
      );
      setShowReviewModal(false);
    } else {
      setRatingRequiredAlert(true);
    }
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ocjena</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonAlert
          isOpen={showRatingRequiredAlert}
          onDidDismiss={() => setRatingRequiredAlert(false)}
          header={"Greška!"}
          message={"Ocjena je obavezna!"}
          buttons={["U redu"]}
        />

        <ProfileCard user={userToReview} userId={favor.ownerId} />

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
              onIonChange={(e) => setComment(e.target.value)}
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
            onClick={() => handleReview()}
          >
            Ocjeni
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </>
  );
};

export default withRouter(ReviewPage);
