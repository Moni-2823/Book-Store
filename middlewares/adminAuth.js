// auth check for admin
module.exports = (req, res, next) => {
    console.log("res",res)
    if(req.user.role === 'Admin') {
        return next()
    }
    res.status(400).send({code: 400, message: "Not an admin account"});
}