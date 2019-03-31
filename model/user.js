const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

let userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

module.exports.getUserById = (id, callback)=>{
    User.findById(id, callback);
};

module.exports.getUserByEmail = (email, callback)=>{
    let query = { email : email};
    User.findOne(query, callback);
};

module.exports.validatePassword = (candidatePassword, hash, callback)=>{
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        callback(null,isMatch);
    });
};



module.exports.hashPassword = async (password) => {
    try{
        const salt = await bcrypt.genSalt(0);
        return await bcrypt.hash(password, salt);
    }catch(error){
        throw new Error('Hashing Failed', error);
    }
}
