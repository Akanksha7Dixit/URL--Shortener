import express from "express";
import { shortenerRoutes } from "./routes/shortner.routes.js";
import path from "path";

const app=express();

const PORT = process.env.PORT||3001;

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(shortenerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
