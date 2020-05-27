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
  IonButtons,
} from "@ionic/react";

import { star, starOutline } from "ionicons/icons";

import "./ReviewPage.css";

import { states, types, triggers } from "../../scheme";

import { showStarsDescription } from "../../utils";

import { withRouter } from "react-router";

import ProfileCard from "../../components/Cards/ProfileCard";

import * as db from "../../db";

const ReviewPage = ({
  userReviewing,
  userToReview,
  favor,
  favorId,
  setShowReviewModal,
  onUserReview,
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
      onUserReview();
      setShowReviewModal(false);
    } else {
      setRatingRequiredAlert(true);
    }
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ocjeni</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowReviewModal(false)}>
              Odustani
            </IonButton>
          </IonButtons>
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

        <ProfileCard user={userToReview} />

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
