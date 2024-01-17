const path = require("path")
const Blog = require(path.join(__dirname, "..", "models", "blogModel.js"))
const User = require(path.join(__dirname, "..", "models", "userModel.js"))
const validateMongoDbId = require(path.join(__dirname, "..", "utils", "validateMongodbid.js"))
const { logEvents } = require(path.join(__dirname, "..", "middlewares", "logEvents.js"))
const createBlog = async(req, res) => {
try{
const newBlog = await Blog.create(req.body)
res.json( newBlog)
}catch(error){
    logEvents(`${error.name}:${error.message}`, "createBlogError.txt", "blog")
}
}
const updateBlog = async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try{
 const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {new : true});

 res.status(201).json(updateBlog)
    }catch(error){
        logEvents(`${error.name}:${error.message}`, "updateBlogError.txt", "blog")
    }
    }
    const getBlog = async (req, res) => {
        const {id} = req.params;
        validateMongoDbId(id)
        try{
     await Blog.findByIdAndUpdate(id,{ $inc : {numViews : 1}}, {new : true});
     const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
     res.status(200).json(getBlog)
        }catch(error){
            logEvents(`${error.name}:${error.message}`, "getBlogError.txt", "blog")
        }
        }
        const getAllBlog = async (req, res) => {
            try{
        const getBlogs =  await Blog.find()
         res.status(200).json(getBlogs)
            }catch(error){
                logEvents(`${error.name}:${error.message}`, "getAllBlogError.txt", "blog")
            }
            }
            const deleteBlog = async (req, res) => {
                const {id} = req.params;
                validateMongoDbId(id)
                try{
             const deletedBlog = await Blog.findByIdAndDelete(id);
             res.status(201).json(deletedBlog)
                }catch(error){
                    logEvents(`${error.name}:${error.message}`, "deletedBlogError.txt", "blog")
                }
                }
const likeBlog = async (req, res) => {
const { blogId } = req.body;
console.log(blogId)
validateMongoDbId(blogId);
try{
//Find the blog which you want to be liked
const blog = await Blog.findById(blogId);
//Find the login user
const loginUserId = req?.user?._id;
//find if the user has liked the post
const isLiked = blog?.isLiked; //returns true or false
console.log(isLiked)
//find if the user has disliked the post
const alreadyDisliked = blog?.dislikes?.find((( userId ) => userId?.toString() === loginUserId?.toString()));
if(alreadyDisliked){
const blog =  await Blog.findByIdAndUpdate(blogId, {
    $pull : { dislikes : loginUserId},
    isDisliked : false,
}, { new : true})
return res.json(blog)
}
if(isLiked){
    const blog =  await Blog.findByIdAndUpdate(blogId, {
        $pull : { likes : loginUserId},
        isLiked : false
    }, { new : true})
   return res.json(blog)
}else{
    const blog =  await Blog.findByIdAndUpdate(blogId, {
        $push : { likes : loginUserId},
        isLiked : true
    }, { new : true})
  return  res.json(blog)
}
}catch(error){
    logEvents(`${error.name}:${error.message}`, "likeBlogError.txt", "blog")
}
                }
                const dislikeBlog = async(req, res) => {
                    const { blogId } = req.body;
                    console.log(blogId)
                    validateMongoDbId(blogId);
                    try{
                    //Find the blog which you want to be disliked
                    const blog = await Blog.findById(blogId);
                    //Find the login user
                    const loginUserId = req?.user?._id;
                    //find if the user has disliked the post
                    const isDisLiked = blog?.isDisliked; //returns true or false
                    console.log(isDisLiked)
                    //find if the user has liked the post
                    const alreadyLiked = blog?.likes?.find((( userId ) => userId?.toString() === loginUserId?.toString()));
                    if(alreadyLiked){
                    const blog =  await Blog.findByIdAndUpdate(blogId, {
                        $pull : { likes : loginUserId},
                        isLiked : false
                    }, { new : true})
                   return res.json(blog)
                    }
                    if(isDisLiked){
                        const blog =  await Blog.findByIdAndUpdate(blogId, {
                            $pull : { dislikes : loginUserId},
                            isDisliked : false
                        }, { new : true})
                      return  res.json(blog)
                    }else{
                        const blog =  await Blog.findByIdAndUpdate(blogId, {
                            $push : { dislikes : loginUserId},
                            isDisliked : true
                        }, { new : true})
                      return  res.json(blog)
                    }
                    }catch(error){
                        logEvents(`${error.name}:${error.message}`, "dislikeBlogError.txt", "blog")
                    }
                                    }
module.exports = { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog }
