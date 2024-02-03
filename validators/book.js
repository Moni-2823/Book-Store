const constants = require("../config/constants");

const validateBookData = (req, res, next) => {
    if (!req.body) return res.status(400).json({ message: constants.PAYLOAD_VALIDATION_FAIL });
    if (!req.body.title) return res.status(400).send({ message: constants.PROVIDE_TITLE });
    if (!req.body.author) return res.status(400).send({ message: constants.PROVIDE_AUTHOR });
    if (!req.body.description) return res.status(400).send({ message: constants.PROVIDE_DESCRIPTION });
    if (!req.body.price) return res.status(400).send({ message: constants.PROVIDE_PRICE });
    next();
}

module.exports = { validateBookData }