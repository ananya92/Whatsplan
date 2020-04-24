const router = require("express").Router();
const whatsplanRoutes = require("./wpRoutes");
const userRoutes = require("./userRoutes");

// Whatsplan routes
router.use("/wp", whatsplanRoutes);
router.use("/user", userRoutes);

module.exports = router;
