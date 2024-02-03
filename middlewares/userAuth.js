const jwt = require('jsonwebtoken');
 
const constants = require('../config/constants');
const userModel = require('../models/user');

// check user token
const auth = async (req, res, next) => {
    try {
        if(!req.headers["x-access-token"]) {
            return res.status(401).send({statuscode: 401, message: constants.NO_TOKEN});
        }
        let verifyJWT = jwt.verify(req.headers["x-access-token"],"privateKey");
        req["userEmail"] = verifyJWT.email;

        let user = await userModel.findOne({ token: req.headers["x-access-token"] });
        if(!user) {
            throw new Error
        }
        console.log("auth middleware:::", user.email, user._id);
        next();
    } catch(error) {
        console.log('token error:::',error);
        return res.status(401).send({statuscode: 401, message: constants.USER_VALIDATION_FAIL});
    }
}

module.exports = { auth };