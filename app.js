var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var method = require("method-override"), sanitizer = require("express-sanitizer");
app.use(method("_method"));
mongoose.connect("mongodb://localhost/restfull_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(sanitizer());

//Schema
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : {type: Date , default : Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
//     title : "dog",
//     image : "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//     body  : "This is the cutest DOG "
// });
// RESTfull Routes
app.get("/", function(req, res) {
   res.redirect("/blogs"); 
});
app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR");
        } else {
             res.render("index",{blogs : blogs});
            }
    });
});
// new route
app.get("/blogs/new",function(req, res){
    res.render("new");
}); 
// Create route
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});
//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog:foundBlog});
        }
    });
});
// EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
       Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", { blogs: foundBlog});
        }
    });
});
//UPDATE ROUTES

app.put("/blogs/:id", function(req, res){
   req.body.blog.body = req.sanitize(req.body.blog.body); 
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs/" + req.params.id);
       }
   });
});
//  DELETE ROUTE

app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SErver started");
});










