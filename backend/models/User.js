

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: "Email is required!",
    },
    password: {
        type: String,
        required: "Password is required!",
    },
    role : {
        type : String,
        enum : ['user','admin'],
        required: true
    }
},
{
  timestamps: true,
});


UserSchema.pre('save',function(next){
    if(!this.isModified('password'))
        return next();
    bcrypt.hash(this.password,10,(err,passwordHash)=>{
        if(err)
            return next(err);
        this.password = passwordHash;
        next();
    });
});


UserSchema.methods.comparePassword = function(password,cb){
    bcrypt.compare(password,this.password,(err,isMatch)=>{
        if(err)
            return cb(err);
        else{
            if(!isMatch)
                return cb(null,isMatch);
            return cb(null,this);
        }
    });
}

module.exports = mongoose.model('User', UserSchema);


