const Counter = require('../models/counter');
const Post = require('../models/Post');

const createPost = async (req, res) => {
    console.log("username", req.body);

    try {
        const post = new Post(req.body);
        const newPost = await post.save();

        const currentDate = new Date().toISOString().slice(0, 10);
        const { username } = req.body;

        // Find document for the same date and same username
        let counter = await Counter.findOne({ name: 'createPostApiCalls', createdDate: currentDate, username: username });

        if (counter) {
            // If document exists for the current date and username, increment the counter
            await Counter.findOneAndUpdate(
                { name: 'createPostApiCalls', createdDate: currentDate, username: username },
                { $inc: { count: 1 } }
            );
        } else {
            // If no document exists for the current date and username, create a new one
            await Counter.create({
                name: 'createPostApiCalls',
                count: 1,
                createdDate: currentDate,
                username: username
            });
        }

        return res.status(200).json({ message: "Post saved", newPost });
    } catch (error) {
        console.log("error", error);
        const currentDate = new Date().toISOString().slice(0, 10);
        const { username } = req.body;

        // Find document for the same date and same username
        let counter = await Counter.findOne({ name: 'createPostApiCalls', createdDate: currentDate, username: username });

        if (counter) {
            // If document exists for the current date and username, increment the counter
            await Counter.findOneAndUpdate(
                { name: 'createPostApiCalls', createdDate: currentDate, username: username },
                { $inc: { count: 1 } }
            );
        } else {
            // If no document exists for the current date and username, create a new one
            await Counter.create({
                name: 'createPostApiCalls',
                count: 1,
                createdDate: currentDate,
                username: username
            });
        }

        return res.status(500).json({ message: "Not Posted", error });
    }
}

module.exports = { createPost };
