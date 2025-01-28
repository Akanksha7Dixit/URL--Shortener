import { readFile,writeFile} from "fs/promises";
import { createServer } from "http";
import crypto from "crypto";
import path from "path";
import express from "express";

const app=express();


const PORT = process.env.PORT||3001;
const DATA_FILE=path.join("data","links.json");

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

const serveFile = async (res, filepath, contentType) => {
    try {
        const data = await readFile(filepath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    } catch {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Page not found");
    }

}

const loadLinks= async()=>{
    try {
        const data=await readFile(DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        if(error.code==="ENOENT"){
            await writeFile(DATA_FILE,JSON.stringify({}));
            return {};
        }
        throw error;
    }
};

const saveLinks=async (links)=>{
    await writeFile(DATA_FILE,JSON.stringify(links));
};


app.get("/",async(req,res)=>{
    try {
        const file= await readFile(path.join("views","index.html"));
        const links= await loadLinks();
        
        const content = file.toString().replaceAll(
            "{{shortened_urls}}",
            Object.entries(links)
             .map(
                ([shortCode,url])=>{
                   return `<li><a href="/${shortCode}" target="_blank">${req.get('host')}/${shortCode}</a> -> ${url}</li>`
        })
        .join("")
    );
    
    return res.send(content);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post("/",async(req,res)=>{
    try {
        const { url, shortCode } = req.body;
        const finalShortCode = shortCode ||crypto.randomBytes(4).toString("hex");
        const links= await loadLinks();

        if(links[finalShortCode]){
            return res.status(409).send("Short Code already exists.Please another one")
        }

        links[finalShortCode]=url;
        await saveLinks(links);

    } catch (error) {
        
    }
});

app.get("/:shortCode",async(req,res)=>{
    try {
        const {shortCode}=req.params;
        const links =await loadLinks();

        if(!links[shortCode]){
            return res.status(404).send("Shortened URL not found");
        }
        return res.redirect(links[shortCode]);
    } 
    catch (error) {}
});
            

// const server = createServer(async (req, res) => {
//     console.log(req.url);

//     if (req.method === "GET") {
//         if (req.url === "/") {
//             return serveFile(res, path.join("public", "index.html"), "text/html");
//         }
//         else if (req.url === "/style.css") {
//             return serveFile(res, path.join("public", "style.css"), "text/css");
//         }
//         else if(req.url ==="/links"){
//             const links=await loadLinks();
//             res.writeHead(200,{"Content-Type":"application/json"});
//             return res.end(JSON.stringify(links));
//         }
//         else{
//             const links= await loadLinks();
//             const shortCode = req.url.slice(1);
//             console.log("Links redirecting",req.url);

//             if(links[shortCode]){
//                 res.writeHead(302,{location:links[shortCode]});
//                 return res.end();
//             }

//             res.writeHead(404,{"Content-Type":"text/plain"});
//             return res.end("shortened url is not found!")
//         }

//     }

//     // if (req.method === "POST" && req.url === "/shorten") {

//     //     const links=await loadLinks();

//     //     let body = "";
//     //     req.on("data", (chunk) => {
//     //         body += chunk;
//     //     })
//     //     req.on("end", async() => {
//     //         console.log(body);
//     //         const { url, shortCode } = JSON.parse(body);

//     //         if(!url){
//     //             res.writeHead(400,{"Content-Type":"text/plain"});
//     //             return res.end("URL is required");
//     //         }
            
//     //         const finalShortCode = shortCode ||crypto.randomBytes(4).toString("hex");

//     //         if(links[finalShortCode]){
//     //             res.writeHead(409,{"Content-Type":"text/plain"});
//     //             return res.end("Short code already exists.Please try another one.");
//     //         }

//     //         links[finalShortCode]=url;
//     //         await saveLinks(links);

//     //         res.writeHead(200,{"Content-Type":"application/json"});
//     //         res.end(JSON.stringify({shortCode:finalShortCode}));
            

//     //     })
//     // }
// });

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
