import mongoose from "mongoose";

const ProjectFileSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    path: {
      type: String,
      default: "",
      trim: true,
    },

    mimeType: {
      type: String,
      default: "application/octet-stream",
    },

    extension: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    /*
     * Whether the file can be opened
     * inside ProjectHub's editor.
     */
    editable: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      default: "raw",
    },

    format: {
      type: String,
      default: "",
    },

    size: {
      type: Number,
      default: 0,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /*
     * ============================================================
     * ERROR TRACKING
     * ============================================================
     */

    hasError: {
      type: Boolean,
      default: false,
    },

    errorDescription: {
      type: String,
      default: "",
      trim: true,
    },

    errorStartLine: {
      type: Number,
      default: null, 
    },

    errorEndLine: {
      type: Number,
      default: null,
    },

    errorMarkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    errorMarkedAt: {
      type: Date,
      default: null,
    },

    /*
     * ============================================================
     * FIX TRACKING
     * ============================================================
     */

    lastFixedAt: {
      type: Date,
      default: null,
    },

    lastFixedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    fixNote: {
      type: String,
      default: "",
      trim: true,
    },

    /*
     * Every successful save creates a new version.
     */
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ProjectFile ||
  mongoose.model("ProjectFile", ProjectFileSchema);