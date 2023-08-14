const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hash : String, 
    salt : String 
},{
    timestamps: true
});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex'); 
    this.hash = crypto.pbkdf2Sync(password, this.salt,  
    1000, 64, `sha512`).toString(`hex`); 
}
userSchema.methods.validPassword = function(password){
    console.log("validate:",password);
    var hash = crypto.pbkdf2Sync(password,  
    this.salt, 1000, 64, `sha512`).toString(`hex`);
    //console.log(this.hash === hash); 
    return this.hash === hash;
}


const User = mongoose.model('User', userSchema);

module.exports = User;