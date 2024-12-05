import express from "express";
import { v4 } from "uuid";
import bodyParser from "body-parser";

let articleList = [];
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  let article = articleList[articleList.length - 1];
  let latest = articleList.slice(-3).reverse();

  res.render("index.ejs", {
    article: article,
    latestArticles: latest,
    articleList: articleList,
  });
});

app.post("/", (req, res) => {
  let randomNum = Math.floor(Math.random() * 14) + 1;
  let article = {
    title: req.body.title,
    text: req.body.text,
    date: new Date().toLocaleDateString(),
    uniqueId: v4(),
    imgnum: randomNum,
  };
  articleList.push(article);
  let latest = articleList.slice(-3).reverse();
  res.render("index.ejs", { article: article, latestArticles: latest });
});

app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/articles", (req, res) => {
  let latest = articleList.slice(-3).reverse();
  res.render("articles.ejs", {
    articleList: articleList,
    latestArticles: latest,
  });
});

app.get("/articles/:id", (req, res) => {
  let id = req.params.id;
  let articleToEdit = articleList.find((article) => article.uniqueId === id);

  res.render("single-article.ejs", { articleToEdit });
});

app.post("/articles/edit/:id", (req, res) => {
  let id = req.params.id;
  let articleToEdit = articleList.find((article) => article.uniqueId === id);
  articleToEdit.title = req.body.title;
  articleToEdit.text = req.body.text;
  articleToEdit.date = new Date().toLocaleDateString();

  res.redirect("/");
});

app.post("/articles/delete/:id", (req, res) => {
  let id = req.params.id;
  function removeObjectById(arr, id) {
    return arr.filter((obj) => obj.uniqueId != id);
  }

  articleList = removeObjectById(articleList, id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
