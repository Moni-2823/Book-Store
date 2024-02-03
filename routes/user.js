const express = require('express');
const user = require('../controllers/user');
const lowerCaseConverter = require('../middlewares/lowerCaseConverter');
const {userSignupDataValidator, userLoginDataValidator} = require('../validators/adminValidator');

const router = express.Router();

router.route('/signup'). post([lowerCaseConverter, userSignupDataValidator], user.signup);
router.route('/login').post([userLoginDataValidator], user.login);

module.exports = router;