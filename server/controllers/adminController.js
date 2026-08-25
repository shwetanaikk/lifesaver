const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");

exports.getStats = async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ role: "donor" });
    const availableDonors = await User.countDocuments({
      role: "donor",
      availability: true,
    });
    const totalRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({
      status: "pending",
    });
    const fulfilledRequests = await BloodRequest.countDocuments({
      status: "fulfilled",
    });

    const bloodGroupStats = await User.aggregate([
      { $match: { role: "donor" } },
      { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentRequests = await BloodRequest.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalDonors,
        availableDonors,
        totalRequests,
        pendingRequests,
        fulfilledRequests,
        bloodGroupStats,
        recentRequests,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};