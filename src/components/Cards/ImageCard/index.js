import React, { useState } from "react";

import "./style.css";

const ImageCard = ({ url, caption, orientation }) => {
  return (
    <div className="image-card">
      <img className={orientation} src={url} />
      <br />
    </div>
  );
};

export default ImageCard;
