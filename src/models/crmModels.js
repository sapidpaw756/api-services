import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10; 
const emailRegex = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const contactSchema = new Schema({
    firstName :{
        type: String,
        required: 'Enter a first name'
    },
    lastName :{
        type: String,
        required: 'Enter a last name'
    },
    email:{
        type: String,
        required: [true, 'User email is required'],
        match: [emailRegex, 'Please provide a valid email address']
    },
    phone:{
        type: Number
    },
    address:{
        type: String
    },
    username: { 
        type: String, 
        required: true, 
        index: { unique: true } 
    },
    password: { 
        type: String, 
        required: true 
    },
    created_date:{
        type: Date,
        default: Date.now
    }
})

contactSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

contactSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
