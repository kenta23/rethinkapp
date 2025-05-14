import axios from "axios";
import fs from 'fs'
import path from 'path';
import { mkdirp } from 'mkdirp';


export async function downloadFile(file_key: string | string[]) {

    try {
        // Obtain file URL from the database
        const getFile = `https://hl1femsdux.ufs.sh/f/${file_key}`;

        // Extract filename from URL
        // const filename = path.basename(fileData);
        const folderPath = `/tmp/uploads/${file_key}`;

        // Create directory if it doesn't exist
        await mkdirp(folderPath);

        // Construct full file path
        const filePath = path.join(folderPath, file_key as string); 

        const response = await axios.get(getFile, { responseType: 'arraybuffer' });

        // just save the original .pdf file to the local machine
        fs.writeFileSync(filePath, response.data);  
   
        console.log('File downloaded successfully.', filePath);
        console.log('response', response.status);

        return filePath;

    } catch (error) {
        console.error('Error downloading file:', error);
        throw error; // Rethrow the error for handling in the caller function
    }

}