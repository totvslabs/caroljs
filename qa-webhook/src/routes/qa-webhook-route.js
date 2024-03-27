const express = require('express');
const router = express();
const qaWebhookController = require("../controllers/qa-webhook-controller");

router.get('/about', (req, res) => {
    res.json({
        version: '1.0.0',
    });
});
router.post('/', qaWebhookController.message);
router.get('/', qaWebhookController.list);
router.get('/paginated', qaWebhookController.listPaginated);

module.exports = router;