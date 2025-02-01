import express from "express";
import { shortenerRoutes } from "./routes/shortner.routes.js";
import path from "path";

const app=express();
 
const PORT = process.env.PORT||3001;

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");

// app.set("views,"./views");
//In express.js,a template engine is a tool that that lets you embed dynamic content into HTML files and render them on the server before sending them to the client.It allows you to create reuasable HTML templates ,making it easier to generate dynamic web pages with minimal code.


app.use(express.json());
app.use(shortenerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
