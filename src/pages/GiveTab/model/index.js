import { Model } from "react-model";

import takePicture from "../../../services/camera";
import * as db from "../../../db";

// Define model
const Inputs = {
  state: {
    title: "",
    titlePlaceholder: "",
    description: "",
    descriptionPlaceholder: "",
    skills: [],
    photo: undefined,
    dateDue: new Date(),
    // alert modals
    showAllFieldsRequired: false,
    showOptionalImageAlert: false,
    isValid: false,
    favorId: null,
  },
  actions: {
    setTitle: (title) => {
      return (state) => {
        state.title = title;
      };
    },
    setDescription: (description) => {
      return (state) => {
        state.description = description;
      };
    },
    setSkills: (skills) => {
      return (state) => {
        state.skills = skills;
      };
    },
    setDateDue: (dateDue) => {
      return (state) => {
        state.dateDue = new Date(dateDue.replace(/-/g, "/").replace("T", " "));
      };
    },
    handlePhoto: async () => {
      let image = await takePicture();
      return (state) => {
        state.photo = image;
      };
    },
    setPlaceholders: ({ title, description }) => {
      return (state) => {
        state.titlePlaceholder = title;
        state.descriptionPlaceholder = description;
      };
    },
    validateInputs: (callback, { state, actions }) => {
      if (
        state.title &&
        state.description &&
        state.skills.length &&
        state.dateDue
      ) {
        // Show photo alert
        if (state.photo === undefined) {
          actions.setShowOptionalImageAlert(true);
        } else {
          actions.setIsValid(true);
          callback();
        }
      } else {
        actions.setShowAllFieldsRequired(true);
      }
    },
    setShowAllFieldsRequired: (boolVal) => {
      return (state) => {
        state.showAllFieldsRequired = boolVal;
      };
    },
    setShowOptionalImageAlert: (boolVal) => {
      return (state) => {
        state.showOptionalImageAlert = boolVal;
      };
    },
    setIsValid: (boolVal) => {
      return (state) => {
        state.isValid = boolVal;
      };
    },
    createFavor: async (globalUser, { state }) => {
      let { id, location } = globalUser;

      let favorId = await db.createFavor({
        ownerId: id,
        location: location,
        title: state.title,
        description: state.description,
        skills: state.skills,
        dateDue: state.dateDue.toISOString(),
      });

      // Store photo
      if (state.photo) {
        let { data, format } = state.photo;
        let picUrl = await db.storeFavorPicture(favorId, data, format);
        // Update picture url field
        await db.updateFavor(favorId, {
          picUrl,
        });
      }

      return (state) => {
        state.favorId = favorId;
      };
    },
  },
};

// Register model
export const { useStore, subscribe, getState } = Model({ Inputs });
