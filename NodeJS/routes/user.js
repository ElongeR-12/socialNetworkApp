const express = require('express');
const router = express.Router();
const verifySignUp = require('../middleware/verifySignUp');
const userCtrl = require('../controllers/user');

router.post('/signup',[verifySignUp.checkDuplicateUserNameOrEmail], userCtrl.signup);
router.post('/signin', userCtrl.signin);
router.get('/:id', userCtrl.getOneUser);
router.delete('/:id', userCtrl.deleteUser);
// router.get('/users', userCtrl.getUsers);

module.exports = router;