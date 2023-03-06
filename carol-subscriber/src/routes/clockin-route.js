const express = require('express');
const router = express();
const clockinController = require("../controllers/clockin-controller");

router.post('/', clockinController.message);
router.get('/', clockinController.list);

module.exports = router;