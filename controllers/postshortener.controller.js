import crypto from "crypto";
import path from "path";
import { readFile } from "fs/promises";
import { loadLinks,saveLinks } from "../models/shortener.model.js";

export const getShortenerPage = async(req,res)=>{
    try {
        const file= await readFile(path.join("views","index.html"),"utf-8");
        const links= await loadLinks();
        
        const content = file.replace(
            "{{shortened_urls}}",
            Object.entries(links)
             .map(
                ([shortCode,url])=>
                   `<li><a href="/${shortCode}" target="_blank">${req.get('host')}/${shortCode}</a> -> ${url}</li>`
        )
        .join("")
    );
    
    return res.send(content);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

export const postURLshortener = async(req,res)=>{
    try {
        const { url, shortCode } = req.body;
        const finalShortCode = shortCode ||crypto.randomBytes(4).toString("hex");
        const links= await loadLinks();

        if(links[finalShortCode]){
            return res.status(409).send("Short Code already exists.Please another one")
        }

        links[finalShortCode]=url;
        await saveLinks(links);

        return res.redirect("/");

    } catch (error) {
        
    }
};

export const redirectToShortLink = async(req,res)=>{
    try {
        const {shortCode}=req.params;
        const links =await loadLinks();

        if(!links[shortCode]){
            return res.status(404).send("Shortened URL not found");
        }
        return res.redirect(links[shortCode]);
    } 
    catch (error) {}
};