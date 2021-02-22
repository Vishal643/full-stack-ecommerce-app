const express = require('express');

const router = express.Router();

//import middlewares
const { authCheck } = require('../middlewares/auth');

//import controllers
const { createOrUpdateUser } = require('../controllers/auth');

router.post('/create-or-update-user', authCheck, createOrUpdateUser);

module.exports = router;
