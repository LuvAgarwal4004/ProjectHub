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
        },
        mimeType: {
            type: String,
            default: "application/octet-stream",
        },
        extension: {
            type: String,
            default: "",
        },
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
            default: "auto",
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
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.ProjectFile ||
    mongoose.model("ProjectFile", ProjectFileSchema);