const mongodb = require('mongoose');

const adminSchema = new mongodb.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongodb.model('Admin', adminSchema);
