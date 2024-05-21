const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    name: { type: String, required: true},
    username:{
        type:String,
        required:true
    },
    count: { type: Number, default: 0 },
    createdDate:{
        type:Date
    }
});

const Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;
