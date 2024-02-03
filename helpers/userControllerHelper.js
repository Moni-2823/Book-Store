const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const constants = require('./../config/constants');

    createToken = async (email) => {
        return new Promise((resolve,reject) => {
            try {
                resolve(jwt.sign({ email },"privateKey"));
            } catch(error) {
                console.log('token sign',error);
                reject(constants.TOKEN_CREATE_FAIL);
            }
        })
    }

    encryptPassword = async (password) => {
        return new Promise((resolve,reject) => {
            try {
                const salt = bcrypt.genSaltSync(constants.SALT_ROUNDS);
                const hash = bcrypt.hashSync(password,salt);
                resolve(hash);
            } catch(error) {
                reject(constants.PASSWORD_HASH_ERR);
                console.log('error',error);
            }
        })
    }

    matchPassword = async (password,hashedPassword) => {
        return new Promise((resolve,reject) => {
            try { 
                if(bcrypt.compareSync(password,hashedPassword)) {
                    resolve(constants.PASSWORD_MATCHED);
                }
                reject({message: constants.PASSWORD_UNMATCHED});
            } catch(err) {
                reject({message: constants.PASSWORD_HASH_ERR});
                console.log('error',err);
            }
        })
    }

    generateOtp = () => {
        return new Promise((resolve, reject) => {
            // Function to generate OTP
            // Declare a digits variable 
            // which stores all digits
            let digits = '0123456789';
            let OTPstring = '';
            for (let i = 0; i < 6; i++ ) {
                OTPstring += digits[Math.floor(Math.random() * 10)];
            }
            let otp = {
                value: OTPstring,
                createdAt: new Date(),
                expiresIn: Date.parse(new Date()) + 300000
            }
            resolve (otp);
        })
    }

    isOtpExpired = async (date,expiresIn) => {
        return new Promise ((resolve,reject) => {
            if(new Date() < expiresIn) {
                return resolve(true)
            }
            console.log('falseeeeee');
            reject(constants.OTP_EXPIRED);
        })
    }

module.exports = {createToken,encryptPassword,matchPassword,isOtpExpired, generateOtp};