const express = require('express');
const router = express();
const clockinController = require("../controllers/clockin-controller");

router.post("/message", clockinController.message);

module.exports = router;