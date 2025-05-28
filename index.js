import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let posts = [];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));



function blogPost(title, content, author) {
    this.id = Date.now();
    this.title = title;
    this.content = content;
    this.author = author;
}

app.get("/", (req, res) => {
    let htmlContent = '';

    for (let i = 0; i < posts.length; i++) {
        htmlContent += `<div class="col">
            <div class="card shadow-sm">
                <div class="card-body py-1">
                    <h3>${posts[i].title}</h3>
                </div>
                <div class="card-body pt-0">
                    <p class="card-text">${posts[i].content}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                            <form method="POST" action="/delete" style="display:inline;">
                                <input type="hidden" name="id" value="${posts[i].id}">
                                <input type="submit" value="Delete" class="btn btn-sm btn-outline-secondary">
                            </form>
                            <form method="POST" action="/edit" style="display:inline;">
                                <input type="hidden" name="id" value="${posts[i].id}">
                                <input type="submit" value="Edit" class="btn btn-sm btn-outline-secondary">
                            </form>
                        </div>
                        <small class="text-body-secondary"><strong>By:</strong> ${posts[i].author}</small>
                    </div>
                </div>
            </div>
        </div>`;
    }
    res.render("index.ejs", { htmlContent });
});


app.post("/submit", (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    posts.push(new blogPost(title, content, author));
    console.log(posts);
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const postId = req.body.id;
    posts = posts.filter(post => post.id !== parseInt(postId));
    console.log(posts);
    res.redirect("/");
});

app.post("/edit", (req, res) => {
    const postId = parseInt(req.body.id);
    const post = posts.find(post => post.id === postId);
    if (post) {
        res.render("edit.ejs", { post });
    } else {
        res.redirect("/");
    }
});


app.post("/update", (req, res) => {
    const postId = parseInt(req.body.id);
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        posts[postIndex].title = req.body.title;
        posts[postIndex].content = req.body.content;
        posts[postIndex].author = req.body.author;
    }
    res.redirect("/");
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
