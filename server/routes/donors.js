const express = require("express");
const router = express.Router();
const {
  getDonors,
  getDonorById,
  toggleAvailability,
  getDonorStats,
} = require("../controllers/donorController");
const { protect } = require("../middleware/auth");

router.get("/", getDonors);
router.get("/stats", getDonorStats);
router.get("/:id", getDonorById);
router.patch("/availability", protect, toggleAvailability);

module.exports = router;