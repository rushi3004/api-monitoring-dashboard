const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    cretedBy:{
        type:mongoose.ObjectId,
        ref:'userinfos'
    }
});

// Create a model for the counter
const Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;
