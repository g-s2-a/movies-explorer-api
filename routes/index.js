const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');

router.use('/', require('./signup'));
router.use('/', require('./signin'));

// авторизация
router.use(auth);

router.use('/', require('./users'));
router.use('/', require('./movies'));

module.exports = router;
