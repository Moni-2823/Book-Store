const mongoose = require("mongoose"); //import mongoose module

function connectMongo() {
    try {
        mongoose.connect('mongodb://127.0.0.1/bookStrore',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        mongoose.connection.on('connected', ()=> {
            console.log(':::connected to database:::');
        });
        mongoose.connection.on('disconnected', ()=> {
            console.log('disconnected to database');
        });

        //event to catch error in the database connection
        mongoose.connection.on('error', (err)=>{
            console.log('error in conn',err);
        });
    } catch(error) {
        console.log('db connection error:::',error);
    }
}

module.exports = connectMongo