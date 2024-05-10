const Post = require('../models/Post');
const Counter = require('../models/counter');

const createPost = async (req, res) => {
    console.log("username", req.body);
    try {
        const post = new Post(req.body);
        const newPost = await post.save();


        const currentDate = new Date().toISOString().slice(0,10)
        // Increment counter in the database for successful API calls
        await Counter.findOneAndUpdate({ name: 'createPostApiCalls' }, { $inc: { count: 1 },createdDate:currentDate }, { upsert: true });
        return res.status(200).json({ message: "Post saved", newPost });
    } catch (error) {
        console.log("error", error);
        // Increment counter in the database for failed API calls
        await Counter.findOneAndUpdate({ name: 'createPostApiCalls' }, { $inc: { count: 1 },createdDate:currentDate }, { upsert: true });
        return res.status(500).json({ message: "Not Posted", error });
    }
};



module.exports = { createPost};
