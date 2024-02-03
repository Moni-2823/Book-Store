// convert request to lower case
const lowerCaseConverter = (req, res, next) => {
    if(req?.body?.email) req.body.email = req.body.email.toLowerCase()
    next() 
}

module.exports = lowerCaseConverter ;