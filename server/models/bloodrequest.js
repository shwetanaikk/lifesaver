const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    hospital: {
      type: String,
      required: [true, "Hospital name is required"],
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    emergencyLevel: {
      type: String,
      enum: ["critical", "high", "moderate"],
      default: "high",
    },
    unitsRequired: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["pending", "fulfilled", "cancelled"],
      default: "pending",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);