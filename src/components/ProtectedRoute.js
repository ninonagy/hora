import React from "react";
import { Route, Redirect } from "react-router";
import useGlobal from "../state";

const ProtectedRoute = ({ component: Component, path, ...other }) => {
  const [globalState, {}] = useGlobal();

  return (
    <Route
      {...other}
      path={path}
      render={(props) =>
        globalState.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
