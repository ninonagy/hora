import React from "react";

import { withRouter } from "react-router";

import {
  IonText,
  IonAvatar,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
} from "@ionic/react";

import RatingIcons from "../shared/RatingIcons";

import "./ProfileCard.css";

const getAge = (birthDate) =>
  new Date().getFullYear() - new Date(birthDate).getFullYear();

const ProfileCard = ({ user, userId, history }) => {
  return (
    <IonCard
      style={{
        background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("https://picsum.photos/seed/${user.email}/500/300?blur=10")`,
      }}
    >
      <IonCardContent onClick={() => history.push(`/user/${userId}`)}>
        <IonGrid>
          <IonRow className="ion-align-items-center">
            <IonCol size="4">
              <IonAvatar className="favor-avatar">
                <IonImg src={user.pictureLink} />
              </IonAvatar>
            </IonCol>
            <IonCol>
              <IonText className="FavorUserName">
                {user.name}, {getAge(user.birthDate)}
              </IonText>
              <br />
              <RatingIcons
                timeEarned={user.timeEarned}
                timeSpent={user.timeSpent}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default withRouter(ProfileCard);
