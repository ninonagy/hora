import React from "react";
import ProfilePage from "./ProfilePage";

const PublicProfilePage = (props) => {
  // TODO(Karlo): I was lazy here :D (Make real public profile page)

  return <ProfilePage isPublic={true} {...props} />;
};

export default PublicProfilePage;
