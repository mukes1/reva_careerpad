const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

let adminSchema = new Schema({
    employeeId: {
        type: String,
        match: /[a-zA-z0-9]/,
        maxlength: 10,
        default: '',
        required: true
    },
    employeeEmail: {
        type: String,
        required: true
    },
    employeePassword: {
        type: String,
        required: true,
    },
    employeeName: {
        type: String,
        required: true,
    }
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;

module.exports.getAdminById = (id, callback) => {
    Admin.findById(id, callback);
};

module.exports.getAdminByEmail = (email, callback) => {
    let query = {
        email: email
    };
    Admin.findOne(query, callback);
};

module.exports.validatePassword = (password, hash, callback)=> {
    bcrypt.compare(password, hash, (err,isMatch)=>{
        callback(null, isMatch);
    });
};

module.exports.hashPassword = async (password) => {
    try{
        const salt = await bcrypt.genSalt(0);
        return await bcrypt.hash(password, salt);
    }catch(err){
        throw new Error('Hashing Failed', error);
    }
}
