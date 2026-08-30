const ngoSetupModel = require("../models/ngoSetupModel");

async function saveIdentity(req, res) {
  try {
    const { userId, ...data } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    await ngoSetupModel.saveNgoIdentity(userId, data);
    return res.status(200).json({ message: "NGO basic identity saved successfully." });
  } catch (err) {
    console.error("saveIdentity error:", err);
    return res.status(500).json({ message: "Failed to save NGO identity." });
  }
}

async function getIdentity(req, res) {
  try {
    const { userId } = req.params;
    const identity = await ngoSetupModel.getNgoIdentity(userId);
    return res.status(200).json({ identity });
  } catch (err) {
    console.error("getIdentity error:", err);
    return res.status(500).json({ message: "Failed to fetch NGO identity." });
  }
}

async function saveContact(req, res) {
  try {
    const { userId, ...data } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    await ngoSetupModel.saveNgoContact(userId, data);
    return res.status(200).json({ message: "NGO contact details saved successfully." });
  } catch (err) {
    console.error("saveContact error:", err);
    return res.status(500).json({ message: "Failed to save NGO contact details." });
  }
}

async function getContact(req, res) {
  try {
    const { userId } = req.params;
    const contact = await ngoSetupModel.getNgoContact(userId);
    return res.status(200).json({ contact });
  } catch (err) {
    console.error("getContact error:", err);
    return res.status(500).json({ message: "Failed to fetch NGO contact details." });
  }
}

async function saveLegal(req, res) {
  try {
    const { userId, ...data } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    await ngoSetupModel.saveNgoLegal(userId, data);
    return res.status(200).json({ message: "NGO legal documents saved successfully." });
  } catch (err) {
    console.error("saveLegal error:", err);
    return res.status(500).json({ message: "Failed to save NGO legal documents." });
  }
}

async function getLegal(req, res) {
  try {
    const { userId } = req.params;
    const legal = await ngoSetupModel.getNgoLegal(userId);
    return res.status(200).json({ legal });
  } catch (err) {
    console.error("getLegal error:", err);
    return res.status(500).json({ message: "Failed to fetch NGO legal documents." });
  }
}

module.exports = {
  saveIdentity,
  getIdentity,
  saveContact,
  getContact,
  saveLegal,
  getLegal,
};
