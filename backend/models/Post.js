const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
}, {
    collection: "postinfo"
});

const Post = mongoose.model("postinfo", postSchema);

module.exports = Post;
