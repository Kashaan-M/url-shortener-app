const express = require('express');
const { setUrl, getOriginal } = require('../controllers/url');
const router = express.Router();

router.post('/', setUrl);
router.get('/:short', getOriginal);

module.exports = router;
