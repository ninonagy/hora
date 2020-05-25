import React, { useEffect, useState } from "react";
import {
  IonChip,
  IonLabel,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
  IonIcon,
  IonImg,
  IonModal,
  IonText,
  IonList,
  IonItem,
} from "@ionic/react";

import { withRouter } from "react-router";

import { settingsOutline } from "ionicons/icons";

import RatingIcons from "../../components/shared/RatingIcons";

import "./ProfilePage.css";

import BackButton from "../../components/Buttons/Back";
import Loader from "../../components/shared/Loader";

import useGlobalState from "../../state";
import * as db from "../../db";
import useCache from "../../hooks/useCache";

const getAge = (birthDate) =>
  new Date().getFullYear() - new Date(birthDate).getFullYear();

const ProfilePage = ({ history, match, isPublic }) => {
  const [globalState, {}] = useGlobalState();
  let [user, setUser] = useState({});
  let [showReviewModal, setShowReviewModal] = useState(false);
  let [reviews, setReviews] = useState([]);
  const skillList = useCache(db.getSkillsList, `/skills`);

  // let publicUser = useCache(
  //   () => db.getUser(match.params.userId),
  //   `/user/${match.params.userId}`,
  //   true
  // );

  useEffect(() => {
    if (isPublic) {
      db.getUser(match.params.userId).then((user) => {
        setUser(user);
      });
    } else {
      db.getUser(globalState.userId).then((user) => {
        let { timeEarned, timeSpent } = user;
        globalState.user.timeEarned = timeEarned;
        globalState.user.timeSpent = timeSpent;
        setUser(globalState.user);
      });
    }
  }, [globalState.user]);

  async function loadReviews() {
    let reviews = await db.getReviews(globalState.userId);
    setReviews(reviews);
  }

  let {
    name,
    surname,
    email,
    bio,
    birthDate,
    location,
    rating,
    timeSpent,
    timeEarned,
    skills,
    pictureLink,
  } = user;

  skills = skills || [];

  let timeAvailable = timeEarned - timeSpent;

  return (
    <IonPage>
      <Loader data={user}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <BackButton />
            </IonButtons>
            <IonTitle>Profil</IonTitle>
            {!isPublic && (
              <IonButtons slot="end">
                <IonButton onClick={() => history.push("profile/edit")}>
                  <IonIcon icon={settingsOutline} />
                </IonButton>
              </IonButtons>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {/* Review list modal */}
          <IonModal isOpen={showReviewModal} onWillPresent={loadReviews}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Ocjene</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowReviewModal(false)}>
                    Zatvori
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonList>
                {/*
                  TODO: Style review card with fields: username, userImage, rating, comment
                */}
                {reviews.map((review) => (
                  <IonItem key={review.id}>
                    <IonImg src={review.userImage}></IonImg>
                    {review.rating}
                    {review.comment}
                  </IonItem>
                ))}
              </IonList>
            </IonContent>
          </IonModal>

          {/* Content */}
          <div
            className="profile-cover"
            style={{
              background: `linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url("https://picsum.photos/seed/${email}/500/300")`,
            }}
          ></div>
          <IonGrid class="profile-margin">
            <IonRow class="ion-align-items-center">
              <IonCol size="2" offset="4">
                <IonAvatar className="profile-avatar">
                  <IonImg src={pictureLink} alt="Avatar" />
                </IonAvatar>
              </IonCol>
              <IonCol size="2" offset="3">
                <div class="profile-coins">
                  <p>{timeAvailable}</p>
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center profile-name">
                {name}, {getAge(birthDate)}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center">
                <RatingIcons timeEarned={timeEarned} timeSpent={timeSpent} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center profile-bio">{bio}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center profile-bio">
                {skillList.all &&
                  skills.map((skill, id) => (
                    <IonChip key={id} outline="true">
                      <IonLabel>{skillList.all[skill]}</IonLabel>
                    </IonChip>
                  ))}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center">
                <IonText
                  color="primary"
                  onClick={() => setShowReviewModal(true)}
                >
                  Pogledaj ocjene
                </IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </Loader>
    </IonPage>
  );
};

export default withRouter(ProfilePage);
