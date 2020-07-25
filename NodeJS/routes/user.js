const express = require('express');
const router = express.Router();
const verifySignUp = require('../middleware/verifySignUp');
const userCtrl = require('../controllers/user');

router.post('/signup',[verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], userCtrl.signup);
router.post('/signin', userCtrl.signin);

module.exports = router;