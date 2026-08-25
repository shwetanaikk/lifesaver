const User = require("../models/User");

exports.getDonors = async (req, res) => {
  try {
    const { bloodGroup, city, availability, page = 1, limit = 12 } = req.query;
    const filter = { role: "donor" };

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = { $regex: city, $options: "i" };
    if (availability !== undefined)
      filter.availability = availability === "true";

    const total = await User.countDocuments(filter);
    const donors = await User.find(filter)
      .select("-password")
      .sort({ availability: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ success: true, total, donors });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching donors." });
  }
};

exports.getDonorById = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id).select("-password");
    if (!donor)
      return res
        .status(404)
        .json({ success: false, message: "Donor not found." });
    res.status(200).json({ success: true, donor });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.availability = !user.availability;
    await user.save();
    res.status(200).json({
      success: true,
      message: `You are now ${user.availability ? "available" : "unavailable"}.`,
      availability: user.availability,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.getDonorStats = async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ role: "donor" });
    const availableDonors = await User.countDocuments({
      role: "donor",
      availability: true,
    });
    const cities = await User.distinct("city", { role: "donor" });

    const bloodGroupStats = await User.aggregate([
      { $match: { role: "donor" } },
      {
        $group: {
          _id: "$bloodGroup",
          count: { $sum: 1 },
          available: { $sum: { $cond: ["$availability", 1, 0] } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: { totalDonors, availableDonors, totalCities: cities.length, bloodGroupStats },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};