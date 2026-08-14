import mongoose from "mongoose";

const ProjectTaskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    deadlineDate: {
      type: String,
      default: "",
    },

    deadlineTime: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "todo",
        "in_progress",
        "pending",
        "completed",
      ],
      default: "todo",
    },

    priority: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ProjectTask ||
  mongoose.model("ProjectTask", ProjectTaskSchema);