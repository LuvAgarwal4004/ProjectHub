import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ProjectMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "viewer",
    },
  },
  {
    _id: false,
  }
);

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    /*
     * ============================================================
     * PROJECT STATUS
     * ============================================================
     *
     * open   -> normal project
     * closed -> fixed/finalized project
     *
     * Only an ADMIN can reopen a closed project.
     */

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    /*
     * ============================================================
     * POWERPOINT
     * ============================================================
     */

    pptUrl: {
      type: String,
      default: "",
      trim: true,
    },

    pptName: {
      type: String,
      default: "",
      trim: true,
    },

    members: {
      type: [ProjectMemberSchema],
      default: [],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  model("Project", ProjectSchema);