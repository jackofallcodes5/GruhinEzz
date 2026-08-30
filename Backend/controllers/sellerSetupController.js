const sellerSetupModel = require("../models/sellerSetupModel");

async function saveProfile(req, res) {
  try {
    const { userId, ...data } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    await sellerSetupModel.saveSellerProfile(userId, data);
    return res.status(200).json({ message: "Seller profile saved successfully." });
  } catch (err) {
    console.error("saveProfile error:", err);
    return res.status(500).json({ message: "Failed to save seller profile." });
  }
}

async function getProfile(req, res) {
  try {
    const { userId } = req.params;
    const profile = await sellerSetupModel.getSellerProfile(userId);
    return res.status(200).json({ profile });
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ message: "Failed to fetch seller profile." });
  }
}

async function saveBusiness(req, res) {
  try {
    const { userId, ...data } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    await sellerSetupModel.saveBusinessSetup(userId, data);
    return res.status(200).json({ message: "Business setup saved successfully." });
  } catch (err) {
    console.error("saveBusiness error:", err);
    return res.status(500).json({ message: "Failed to save business setup." });
  }
}

async function getBusiness(req, res) {
  try {
    const { userId } = req.params;
    const business = await sellerSetupModel.getBusinessSetup(userId);
    return res.status(200).json({ business });
  } catch (err) {
    console.error("getBusiness error:", err);
    return res.status(500).json({ message: "Failed to fetch business setup." });
  }
}

async function saveBank(req, res) {
  try {
    const { userId, ...data } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    await sellerSetupModel.saveBankSetup(userId, data);
    return res.status(200).json({ message: "Bank setup saved successfully." });
  } catch (err) {
    console.error("saveBank error:", err);
    return res.status(500).json({ message: "Failed to save bank setup." });
  }
}

async function getBank(req, res) {
  try {
    const { userId } = req.params;
    const bank = await sellerSetupModel.getBankSetup(userId);
    return res.status(200).json({ bank });
  } catch (err) {
    console.error("getBank error:", err);
    return res.status(500).json({ message: "Failed to fetch bank setup." });
  }
}

module.exports = {
  saveProfile,
  getProfile,
  saveBusiness,
  getBusiness,
  saveBank,
  getBank,
};
