const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  methodOverride = require("method-override"),
	  expressSanitizer = require("express-sanitizer"),
	  mongoose = require("mongoose");

const PORT = process.env.PORT || 3000,
	  //DB_URL = process.env.DB_URL_BLOG_APP || "mongodb://localhost/restful_blog_app";
	  DB_URL = process.env.DB_URL_BLOG_APP || "mongodb+srv://taran:Coco1981@cluster-taz-8vczy.mongodb.net/blog_app?retryWrites=true&w=majority";

//MongoDB ATLAS url (to use at Heroku)
//const DB_URL_ATLAS = "mongodb+srv://taran:Coco1981@cluster-taz-8vczy.mongodb.net/blog_app?retryWrites=true&w=majority";

mongoose.connect(DB_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(() => {
	console.log("connected to mongodb :)");
}).catch(err => {
	console.log("ERROR: ", err.message);
});

//APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//SETUP MONGOOSE SCHEMA / MODEL
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("blog", blogSchema);

//RESTful ROUTES
app.get("/", (req, res) => {
	//ROOT ROUTE redirected to INDEX Route
	res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
	//INDEX ROUTE
	(async () => {
		var blogs = await Blog.find({});
		res.render("index", {blogs: blogs});
	})().then(() => {
			console.log("SUCCESS: Found Blogs !!!");
		}).catch(err => {
			console.log("ERROR: ", err.message);
		});	
});

//CREATE ROUTE
app.post("/blogs", (req, res) => {
	//Post route
	//Create blog and redirect to index route
	(async () => {
		req.body.blog.body = req.sanitize(req.body.blog.body);
		//console.log(">>>>>" + req.body.blog.body);
		var newBlog = await Blog.create(req.body.blog);
		res.redirect("/blogs");
	})().then(() => {
			console.log("SUCCESS: New Blog Created !!!");
		}).catch(err => {
			console.log("ERROR: ", err.message);
			res.render("new");
		});	
	
});

//NEW ROUTE
app.get("/blogs/new", (req, res) => {
	//New route
	res.render("new");
});

//SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
	//Show route. find blog by id the show it.
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});	
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
	//update blog by id.
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if (err) {
			res.redirect("/blogs");
		} else {
			console.log("SUCCESS: Blog Updated!");
			res.redirect("/blogs/" + req.params.id);	
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
	//update blog by id.
	Blog.findByIdAndDelete(req.params.id, (err, deletedBlog) => {
		if (err) {
			res.redirect("/blogs");
		} else {
			console.log("SUCCESS: Blog Deleted!");
			res.redirect("/blogs");	
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
	//find blog by id the show it with data loaded.
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});	
		}
	});
});

app.get("*", (req, res) => {
	res.status(404).send("Sorry, page not found! Error Code: 404");
});

app.listen(PORT, process.env.IP, () => console.log("Blog App Server is Listening!"));