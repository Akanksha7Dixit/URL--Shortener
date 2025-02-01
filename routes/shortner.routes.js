
import { Router } from "express";
import { postURLshortener , getShortenerPage ,redirectToShortLink} from "../controllers/postshortener.controller.js";

const router = Router();

router.get("/",getShortenerPage);
router.post("/",postURLshortener);
router.get("/:shortCode",redirectToShortLink);
                                                                                    
router.get("/:shortCode",async(req,res)=>{
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


//default routes
// export default router;

//named router
export const shortenerRoutes=router;
            

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
