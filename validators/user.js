const constants = require("../config/constants");

// user signup data validator
const userSignupDataValidator = async (req, res, next) => {
  if(!req.body) return res.send({statuscode: 400, message: constants.PAYLOAD_VALIDATION_FAIL});
  if (!req.body?.email) return res.status(400).send({statuscode: 400, message: constants.PROVIDE_EMAIL });
  if (!req.body?.password) return res.status(400).send({statuscode: 400, message: constants.PROVIDE_PASS });
  if (!(await validateEmail(req.body?.email, res))?.length) return
  if (!(await validatepassword(req.body?.password, res))) return
  next();
}


// validate email 
const validateEmail = async (email, res) => {
    const matchResult = String(email).toLowerCase().match(constants.EMAIL_REGEX);
    if (!matchResult) {
      res.status(400).send({statuscode: 400, message: constants.INCORRECT_EMAIL});
      return null
    }
    return matchResult
};

// validate password
const validatepassword = async (password, res) => {

  const matchResult = constants.PASSWORD_REGEX.test(password);
  if(!matchResult) {
    res.status(400).send({statuscode: 400, message: constants.INCORRECT_PASSWORD})
    return null
  }
  return matchResult;
};

// user login data validator 
const superAdminLoginDataValidator = async (req, res, next) => {
  if (!req.body) return res.status(400).json({statuscode: 400, message: constants.PAYLOAD_VALIDATION_FAIL });
  if (!req.body?.email) return res.status(400).send({statuscode: 400, message: constants.PROVIDE_EMAIL })
  if (!req.body?.password) return res.status(400).send({statuscode: 400, message: constants.PROVIDE_PASS })
  next();
};

// otp validator 
const OTPValidator = async (req, res, next) => {
  if (!req.body.otp) return res.status(400).send({ message: constants.PROVIDE_OTP })
  if (!req.body?.email) return res.status(400).send({statuscode: 400, message: constants.PROVIDE_EMAIL })
  if (!(await validateEmail(req.body?.email, res))?.length) return
  next()
};

// request for otp validator
const requestOtpValidator = async (req, res, next) => {
  if (!req.body) return res.status(400).json({ message: constants.PAYLOAD_VALIDATION_FAIL });
  if (!req.body.mobile) return res.status(400).send({ message: constants.PROVIDE_MOBILE });
  if (!(await validateMobile(req.body?.mobile, res))) return
  next()
};

// set new password validator
const setNewPasswordValidator = async (req, res, next) => {
  if (!req.body) return res.status(400).json({ message: constants.PAYLOAD_VALIDATION_FAIL });
  if (!req.body?.email) return res.status(400).send({ message: constants.PROVIDE_EMAIL });
  if (!req.body?.newPassword) return res.status(400).send({ message: constants.PROVIDE_NEW_PASS });
  if (!req.body?.confirmPassword) return res.status(400).send({ message: constants.PROVIDE_CONFIRM_PASS });
  if (!(await validateEmail(req.body?.email, res))?.length) return
  if (!(await validatepassword(req.body?.newPassword, res))) return
  if (!(await validatepassword(req.body?.confirmPassword, res))) return
  if (req.body?.newPassword != req.body?.confirmPassword) return res.status(400).send({ message: constants.NEW_CONF_PASS_MISSMATCH })
  req["changePasswordReq"] = true
  next();
};

// user forgot password validator
const forgotPasswordValidator = async (req, res, next) => {
  if (!req.body) return res.status(400).json({ message: constants.PAYLOAD_VALIDATION_FAIL });
  if (!req.body?.email) return res.status(400).send({ message: constants.PROVIDE_EMAIL_OR_PASSWORD });
  if (req.body.email && !(await validateEmail(req.body?.email, res))?.length) return
  req["changePasswordReq"] = true
  next();
};

// super admin update data validator
const superAdminUpdateDataValidator = async (req, res, next) => {
  if(!req.body) return res.send({ message: constants.PAYLOAD_VALIDATION_FAIL });
  if (!req.body?._id) return res.status(400).send({ message: constants.PROVIDE_ID });
  if (!req.body?.profileImage) return res.status(400).send({ message: constants.PROVIDE_PROFILE_IMAGE });
  next();
};

// get user data validator
const getUserDataValidator = async (req, res, next) => {
  if (!req.params) return res.status(400).json({ message: constants.PAYLOAD_VALIDATION_FAIL });
  if (!req.params?._id) return res.status(400).send({ message: constants.PROVIDE_ID });
  next();
};

module.exports = { userSignupDataValidator , superAdminLoginDataValidator, OTPValidator, requestOtpValidator, forgotPasswordValidator, setNewPasswordValidator, superAdminUpdateDataValidator, getUserDataValidator };