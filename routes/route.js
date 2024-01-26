const express = require("express");
const multer=require("multer");
const storageConfig=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname)
    }
})
const upload=multer({storage:storageConfig});
const router = express.Router();
const mongodb = require("mongodb");
const db = require("../data/database");
const ObjectId = mongodb.ObjectId;
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/index', async (req, res) => {
    try {
        const posts = await db.getDb().collection("posts").find().toArray();
        console.log(posts);
        res.render("index", { posts: posts });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).send("Error fetching posts");
    }
})

router.get('/form',(req,res)=>{
    res.render("form")

})
router.post('/index',upload.single('imageupload'),async (req,res)=>{
   const uploadImagefile=req.file;
   const userData=req.body;
   await db.getDb().collection("posts").insertOne({
    name:userData.name,
    imagepath:uploadImagefile.path
   });
    res.redirect('index');
})
module.exports=router;