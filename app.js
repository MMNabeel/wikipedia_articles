const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const app = express();

const mongoose = require("mongoose");

mongoose.set('strictQuery', true);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://Nabeel:786Pakistan1234@cluster0.cctfjtp.mongodb.net/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get(function(req, res){
    Article.find(function(err, foundArticles){
    if (!err) {
      res.send(foundArticles);
    }else {
      res.send(err);
    }
  });
})
  .post(function(req, res){
    const newArticle = new Article( {
     title: req.body.title,
     content: req.body.content
  });
    newArticle.save(function(err){
    if (!err) {
      console.log("Successfully added new Article:");
    }else {
      console.log(err);
    }
  });
})
  .delete(function(req, res){
    Article.deleteMany(function(err){
     if (!err) {
      res.send("Successfully deleted all articles");
    } else {
      res.send(err);
    }
  });
});

///////////////////////////////////////////////Serching Single article/////////////////////

app.route("/articles/:articleTitle")
 .get(function(req, res){
   Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
     if (foundArticle) {
       res.send(foundArticle);
     }else {
       res.send(err);
     }
   });
 })
 .put(function(req, res){
   Article.replaceOne({title: req.params.articleTitle}, {title: req.body.title, content: req.body.content}, {overwrite: true}, function(err){
     if(!err){
       res.send("Successfully updated the record");
     } else{
       res.send(err);
     }
   });
 })
 .patch(function(req, res){
   Article.updateOne({title: req.params.articleTitle}, {$set: req.body}, function(err){
     if (!err) {
       res.send("Successfully updated specific record: ")
     } else {
       res.send(err);
     }
   });
 })
 .delete(function(req, res){
   Article.deleteOne({title: req.params.articleTitle}, function(err){
     if (!err) {
       res.send("Successfully delete the article");
     }else {
       res.send(err);
     }
   });
 });


app.listen(3000, function(){
  console.log("Server started: ");
});
