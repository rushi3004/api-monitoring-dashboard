const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
    {
    title: {
        type: String,
        unique:true,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    cretedBy:{
        type:mongoose.ObjectId,
        ref:'userinfos'
    }
}, 
{
    collection: "postinfo",
  }
);


const Post = mongoose.model("postinfo",postSchema);
module.exports = Post 