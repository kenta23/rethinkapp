import { utapi } from "@/server/uploadthing"
import axios from "axios";
import fs from 'fs'
import path from 'path';
import { mkdirp } from 'mkdirp';

interface File {
    key: string;
    url: string;
}

export async function downloadFile(file_key: string) {

    try {
        // Obtain file URL from the database
        const getFile = await utapi.getFileUrls(file_key);

        // Extract filename from URL
        const filename = path.basename(getFile[0]?.url || '');
        console.log(getFile);
        // Construct folder path
        const folderPath = `/tmp/uploads/${file_key}`;

        // Create directory if it doesn't exist
        await mkdirp(folderPath);

        // Construct full file path
        const filePath = path.join(folderPath, filename);

        // Make HTTP GET request to download the file
        const response = await axios.get(getFile[0]?.url, {
            responseType: 'arraybuffer' // To receive data as Buffer
        });

        // Save the file to the local machine
        fs.writeFileSync(filePath, response.data);
        //convertToPdf(filePath); //convert into pdf

        console.log('File downloaded successfully.', filePath);
        
        return filePath;

    } catch (error) {
        console.error('Error downloading file:', error);
        throw error; // Rethrow the error for handling in the caller function
    }

}