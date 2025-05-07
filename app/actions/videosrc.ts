'use server'

import { utapi } from "@/server/uploadthing"
import path from "path";
import fs from "fs";

export async function getVideoFile() {
     const data = await utapi.getFileUrls(["92514730-8eaa-4410-a334-34838bfc2b85-rat9qd.webm" as string], {
        keyType: 'fileKey'
     });

     return data.data[0]?.url || null;

}