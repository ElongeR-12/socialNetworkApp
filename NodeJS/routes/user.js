const express = require('express');
const router = express.Router();
const verifySignUp = require('../middleware/verifySignUp');
const userCtrl = require('../controllers/user');
const authJwt = require('../middleware/verifyJwtToken');
const joiSchema = require('../middleware/joiSchema');
const rateLimiter = require('../middleware/rateLimiter');
router.post('/signup',[verifySignUp.checkDuplicateUserNameOrEmail], joiSchema.authenticateSchema, userCtrl.signup);
router.post('/signin', rateLimiter.attemptLimit, userCtrl.signin);
router.get('/:id', [authJwt.verifyToken], userCtrl.getOneUser);
router.delete('/:id', [authJwt.verifyToken], userCtrl.deleteUser);
// router.get('/users', userCtrl.getUsers);

module.exports = router;