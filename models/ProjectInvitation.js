import mongoose from "mongoose";

const ProjectInvitationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional.
    // Empty = generic invitation link that can be shared anywhere.
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    role: {
      type: String,
      enum: ["editor", "viewer"],
      default: "viewer",
    },

    // Store ONLY the hash in MongoDB.
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    accepted: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ProjectInvitation ||
  mongoose.model(
    "ProjectInvitation",
    ProjectInvitationSchema
  );