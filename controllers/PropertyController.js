const express = require("express");
const router = express.Router();
const Property = require("../models/PropertyModel.js");
const propertyFormValidation = require("../middleware/propertyRegMidware.js");
const ensureAdminUser = require("../middleware/ensureAdminUser.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get("/", async (req, res) => {
  const properties = await Property.getAllProperties();

  res.render("propertyListingPage", { properties });
});

router.get("/new", ensureAdminUser, (req, res) => {
  res.render("newProperty");
});

router.get("/edit/:id", ensureAdminUser, async (req, res) => {
  const { id } = req.params;
  const property = await Property.getProperty(id);

  res.render("editProperty", { property });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const property = await Property.getProperty(id);

  res.render("propertyDetailsPage", { property });
});

router.post(
  "/",
  upload.single("image"),
  propertyFormValidation,
  ensureAdminUser,
  async (req, res) => {
    const property_data = req.body;
    property_data.imageUrl = req.file.path;

    await Property.createProperties(property_data);

    res.redirect("/users/admin");
  }
);

router.post(
  "/edit/:id",
  upload.single("image"),
  propertyFormValidation,
  ensureAdminUser,
  async (req, res) => {
    const { id } = req.params;
    const property_data = req.body;
    property_data.imageUrl = req.file.path;

    await Property.updateProperty(property_data, id);

    res.redirect("/users/admin");
  }
);

router.post("/delete/:id", ensureAdminUser, async (req, res) => {
  const { id } = req.params;

  await Property.deleteProperty(id);

  res.redirect("/users/admin");
});

module.exports = router;
