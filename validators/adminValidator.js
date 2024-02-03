const constants = require("../config/constants");

// user signup data validator
const userSignupDataValidator = async (req, res, next) => {
  if(!req.body) return res.send({statuscode: 400, message: constants.PAYLOAD_VALIDATION_FAIL});
  if(!req.body?.email) return res.status(400).send({statuscode: 400, message: constants.PROVIDE_EMAIL});
  if (!req.body?.password) return res.status(400).send({statuscode: 400, message: constants.PROVIDE_PASS });
  if (!(await validatepassword(req.body?.password, res))) return
  next();
}

// user login data validator
const userLoginDataValidator = async (req, res, next) => {
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

module.exports = { userSignupDataValidator, userLoginDataValidator};