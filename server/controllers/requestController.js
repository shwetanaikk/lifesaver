const BloodRequest = require("../models/BloodRequest");

exports.createRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      hospital,
      contact,
      location,
      emergencyLevel,
      unitsRequired,
    } = req.body;

    const request = await BloodRequest.create({
      patientName,
      bloodGroup,
      hospital,
      contact,
      location,
      emergencyLevel,
      unitsRequired,
      requestedBy: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      message: "Emergency request posted! Nearby donors will be notified.",
      request,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error creating request." });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const { bloodGroup, location, status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (status) filter.status = status;

    const total = await BloodRequest.countDocuments(filter);
    const requests = await BloodRequest.find(filter)
      .populate("requestedBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ success: true, total, requests });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching requests." });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!request)
      return res
        .status(404)
        .json({ success: false, message: "Request not found." });
    res
      .status(200)
      .json({ success: true, message: "Status updated.", request });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    await BloodRequest.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Request deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};