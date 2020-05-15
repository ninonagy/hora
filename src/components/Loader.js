import React from "react";
import { IonSpinner } from "@ionic/react";

import "./Loader.css";

const isEmptyOrNull = (obj) => {
  if (obj) {
    if (obj.constructor === Array) return obj.length === 0;
    else return obj.constructor === Object && Object.entries(obj).length === 0;
  } else {
    return true;
  }
};

// Spinner that's active while data is loading
const Loader = (props) => {
  const { data } = props;

  if (isEmptyOrNull(data)) {
    return (
      <div className="container">
        <IonSpinner name="dots" className="loader" />
      </div>
    );
  } else {
    return props.children;
  }
};

export default Loader;
