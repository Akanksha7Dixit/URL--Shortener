import { readFile ,writeFile} from "fs/promises";
import { createServer } from "http";
import crypto from "crypto";
import path from "path";

const PORT = 3002;

const DATA_FILE=path.join("data","links.json");

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

const server = createServer(async (req, res) => {
    console.log(req.url);

    if (req.method === "GET") {
        if (req.url === "/") {
            return serveFile(res, path.join("public", "index.html"), "text/html");
        }
        else if (req.url === "/style.css") {
            return serveFile(res, path.join("public", "style.css"), "text/css");
        }
        else if(req.url ==="/links"){
            const links=await loadLinks();
            res.writeHead(200,{"Content-Type":"application/json"});
            return res.end(JSON.stringify(links));
        }

    }

    if (req.method === "POST" && req.url === "/shorten") {

        const links=await loadLinks();

        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        })
        req.on("end", async() => {
            console.log(body);
            const { url, shortCode } = JSON.parse(body);

            if(!url){
                res.writeHead(400,{"Content-Type":"text/plain"});
                return res.end("URL is required");
            }
            
            const finalShortCode = shortCode ||crypto.randomBytes(4).toString("hex");

            if(links[finalShortCode]){
                res.writeHead(409,{"Content-Type":"text/plain"});
                return res.end("Short code already exists.Please try another one.");
            }

            links[finalShortCode]=url;
            await saveLinks(links);

            res.writeHead(200,{"Content-Type":"application/json"});
            res.end(JSON.stringify({shortCode:finalShortCode}));
            

        })
    }
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
