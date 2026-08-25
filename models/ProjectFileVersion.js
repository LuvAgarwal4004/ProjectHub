import mongoose from "mongoose";

const ProjectFileVersionSchema =
  new mongoose.Schema(
    {
      file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectFile",
        required: true,
        index: true,
      },

      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        index: true,
      },

      version: {
        type: Number,
        required: true,
      },

      content: {
        type: String,
        required: true,
      },

      savedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      note: {
        type: String,
        default: "",
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models.ProjectFileVersion ||
  mongoose.model(
    "ProjectFileVersion",
    ProjectFileVersionSchema
  );