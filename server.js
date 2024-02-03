const app = require('./app');

let port = process.env.PORT || 8022;

app.listen(port, function(err) {
    if(err) {
        console.log('error in start server',err);
        return
    }
    console.log(`your app is running on Port : ${port}`);
})