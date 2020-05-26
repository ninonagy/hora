import React, { useState, useEffect } from "react";

import { IonRow, IonGrid, IonButton, IonModal } from "@ionic/react";

import { withRouter } from "react-router";

import Time from "./TimeCard";

import ReviewPage from "../../pages/MessagesTab/ReviewPage";

import * as db from "../../db";
import { triggers } from "../../scheme";
import { userToUserKey } from "../../utils";

const SmallNotificationCard = ({
  history,
  user,
  isThisUser,
  favorId,
  showTimeCard,
  time,
  trigger,
  currentUser,
  ownerReviewed,
  helperReviewed,
  onUserReview,
}) => {
  let [favor, setFavor] = useState({});

  let [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    db.getFavor(favorId).then((favor) => {
      setFavor(favor);
    });
  }, []);

  function returnNotificationtext(user, isThisUser, trigger) {
    if (trigger == triggers.accept) {
      if (isThisUser) return "Prihvatio si pomoć";
      else return user.name + " je prihvatio pomoć";
    } else if (trigger == triggers.decline) {
      if (isThisUser) return "Odbio si pomoć";
      else return user.name + " je odbio pomoć";
    } else if (trigger == triggers.review) {
      if (!isThisUser)
        return (
          user.name +
          " je označio da je usluga zavšena. Sada možeš ocjeniti " +
          user.name +
          "."
        );
      else
        return (
          "Označio si da je usluga završena. Sada možeš ocjeniti " +
          user.name +
          "."
        );
    } else if (trigger == triggers.done) {
      if (isThisUser) return "Označio si da je usluga gotova";
      else return user.name + " je označio da je usluga gotova";
    } else if (trigger == triggers.abort) {
      if (isThisUser) return "Otkazao si uslugu.";
      else return user.name + " je otkazao uslugu.";
    }
  }

  function returnReviewButton(trigger) {
    var showButton = true;
    if (isThisUser && helperReviewed) showButton = false;
    else if (!isThisUser && ownerReviewed) showButton = false;
    if (trigger === triggers.review && showButton)
      return (
        <IonRow className="ion-justify-content-center">
          <IonButton
            className="bigButton"
            color="dark"
            expand="block"
            fill="outline"
            shape="round"
            onClick={() => setShowReviewModal(true)}
          >
            Ocjeni
          </IonButton>
        </IonRow>
      );
  }

  function sendReview() {
    onUserReview(isThisUser ? "helper" : "owner");
  }

  let { title, state } = favor || {};

  return (
    <div>
      {/* Review modal */}
      <IonModal isOpen={showReviewModal}>
        <ReviewPage
          userReviewing={currentUser}
          userToReview={user}
          favor={favor}
          favorId={favorId}
          setShowReviewModal={setShowReviewModal}
          onUserReview={sendReview}
        />
      </IonModal>

      <Time show={showTimeCard} time={time} />

      <IonGrid onClick={(e) => history.push(`/favor/${favorId}`)}>
        <IonRow className="ion-justify-content-center date">
          {returnNotificationtext(user, isThisUser, trigger)}
        </IonRow>
        <IonRow className="ion-justify-content-center hour">{title}</IonRow>
      </IonGrid>
      {returnReviewButton(trigger)}
    </div>
  );
};

export default withRouter(SmallNotificationCard);
