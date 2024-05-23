const Counter = require('../models/counter');
const Post = require('../models/Post');
const multer = require("multer")
const fs = require('fs')
const path = require('path')

const uploadDir = path.join(__dirname,'../Uploads')

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true})
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      console.log(file);
      const unique = Date.now();
      cb(null, unique + '-' + file.originalname); 
    }
  });

const upload = multer({ storage: storage });


const createPost = async (req, res) => {
    
    try {
        let imageBase64 = null;
    if(req.file){
        const fileBuffer = fs.readFileSync(req.file.path);
        imageBase64 = fileBuffer.toString('base64')
    }
        const post = new Post({
            title: req.body.title,
            description: req.body.description,
            username:req.body.username,
            image: imageBase64
        });
        const newPost = await post.save();

        if(req.file){
            fs.unlinkSync(req.file.path)
        }
        
        const currentDate = new Date().toISOString().slice(0, 10);
        const { username } = req.body;

        let counter = await Counter.findOne({ name: 'createPostApiCalls', createdDate: currentDate, username: username });

        if (counter) {
            await Counter.findOneAndUpdate(
                { name: 'createPostApiCalls', createdDate: currentDate, username: username },
                { $inc: { count: 1 } }
            );
        } else {
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

        let counter = await Counter.findOne({ name: 'createPostApiCalls', createdDate: currentDate, username: username });

        if (counter) {
            await Counter.findOneAndUpdate(
                { name: 'createPostApiCalls', createdDate: currentDate, username: username },
                { $inc: { count: 1 } }
            );
        } else {
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

const getAllPost = async (request, response) => {
    let username = request.query.username;
    
    let posts;
    try {
        if(username) 
            posts = await Post.find({ username: username });
        else 
            posts = await Post.find({});
            
        response.status(200).json(posts);
    } catch (error) {
        response.status(500).json(error)
    }
}

module.exports = { createPost ,getAllPost, upload};
