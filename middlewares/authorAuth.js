// auth check for author
module.exports = (req, res, next) => {
    if(req.user.role === 'Author') {
        return next()
    }
    res.status(400).send({code: 400, message: "Not an author account"});
}