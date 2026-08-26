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

const JudgeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      default: "",
      trim: true,
    },
    organization: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    linkedIn: {
      type: String,
      default: "",
      trim: true,
    },
    score: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CertificateSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    recipient: {
      type: String,
      default: "",
      trim: true,
    },
    issuer: {
      type: String,
      default: "",
      trim: true,
    },
    issueDate: {
      type: String,
      default: "",
      trim: true,
    },
    url: {
      type: String,
      default: "",
      trim: true,
    },
    credentialId: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const SponsorAdSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      default: "Sponsorship",
      trim: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["confirmed", "pending", "in_discussion", "completed"],
      default: "confirmed",
    },
    contact: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const MoneyStatusSchema = new Schema(
  {
    currency: {
      type: String,
      default: "$",
      trim: true,
    },
    prizeMoney: {
      type: Number,
      default: 0,
    },
    receivedAmount: {
      type: Number,
      default: 0,
    },
    payoutStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "received",
        "disbursed",
        "not_applicable",
      ],
      default: "pending",
    },
    payoutMethod: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    ads: {
      type: [SponsorAdSchema],
      default: [],
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

    /*
     * ============================================================
     * OTHER INFO (Point 4: Judges, Certificate Store, Money Status & Ads)
     * ============================================================
     */

    judges: {
      type: [JudgeSchema],
      default: [],
    },

    certificates: {
      type: [CertificateSchema],
      default: [],
    },

    moneyStatus: {
      type: MoneyStatusSchema,
      default: () => ({
        currency: "$",
        prizeMoney: 0,
        receivedAmount: 0,
        payoutStatus: "pending",
        payoutMethod: "",
        notes: "",
        ads: [],
      }),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  model("Project", ProjectSchema);