import React, { useState } from "react";

import { IonRow, IonPopover } from "@ionic/react";

import * as db from "../db";

import "./ImageCard.css";

const ImageCard = ({ url, caption, orientation }) => {
  return (
    <div class="image-card">
      <img class={orientation} src={url} />
      <br />
    </div>
  );
};

export default ImageCard;
