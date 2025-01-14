const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    wallet_address: {
        type: String,
        required: true
    },
    private_key: {
        type: String,
        required: true
    },
    tier: {
        type: String,
        enum: ['bronze', 'silver', 'gold'],
        required: true     
    }
});

module.exports = mongoose.model('User', UserSchema);