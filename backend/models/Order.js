const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);