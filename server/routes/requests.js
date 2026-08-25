const express = require("express");
const router = express.Router();
const {
  createRequest,
  getRequests,
  updateStatus,
  deleteRequest,
} = require("../controllers/requestController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/", createRequest);
router.get("/", getRequests);
router.patch("/:id/status", protect, updateStatus);
router.delete("/:id", protect, adminOnly, deleteRequest);

module.exports = router;