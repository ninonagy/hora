import React from "react";
import ProfilePage from "./ProfilePage";
import { withRouter } from "react-router";

const PublicProfilePage = (props) => {
  // TODO(Karlo): I was lazy here :D (Make real public profile page)

  return <ProfilePage isPublic={true} {...props} />;
};

export default withRouter(PublicProfilePage);
