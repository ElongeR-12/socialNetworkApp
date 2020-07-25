const express = require('express');
const router = express.Router();
const authJwt = require('../middleware/verifyJwtToken');
const userPrivilegeCtrl = require('../controllers/user.privilege');

router.get('/user', [authJwt.verifyToken], userPrivilegeCtrl.userContent);

router.get('/pm', [authJwt.verifyToken, authJwt.isPmOrAdmin], userPrivilegeCtrl.managementBoard);

router.get('/admin', [authJwt.verifyToken, authJwt.isAdmin], userPrivilegeCtrl.adminBoard);

module.exports = router;