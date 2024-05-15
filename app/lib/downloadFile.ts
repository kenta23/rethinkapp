import { utapi } from "@/server/uploadthing"
import axios from "axios";
import fs from 'fs'
import path from 'path';
import { mkdirp } from 'mkdirp';


export async function downloadFile(file_key: string | string[]) {

    try {
        // Obtain file URL from the database
        const getFile = await utapi.getFileUrls([file_key as string], {
            keyType: "fileKey"
        })
        const fileData = getFile.data[0].url;

        // Extract filename from URL
        const filename = path.basename(fileData);

        console.log('GET FILE', getFile);
        // Construct folder path
        const folderPath = `/tmp/uploads/${file_key}`;

        // Create directory if it doesn't exist
        await mkdirp(folderPath);

        // Construct full file path
        const filePath = path.join(folderPath, filename); 
    

        // Make HTTP GET request to download the file
        const response = await axios.get(fileData, {
            responseType: 'arraybuffer' // To receive data as Buffer
        });
        // just save the original .pdf file to the local machine
        fs.writeFileSync(filePath, response.data);  
   
        console.log('File downloaded successfully.', filePath);
        return filePath;

    } catch (error) {
        console.error('Error downloading file:', error);
        throw error; // Rethrow the error for handling in the caller function
    }

}