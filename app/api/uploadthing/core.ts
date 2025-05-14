import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from '../../../auth';


const f = createUploadthing(
  {
    errorFormatter: (err) => {
      console.log("Error uploading file", err.message);
      console.log("  - Above error caused by:", err.cause);
  
      return { message: err.message };
    },
  }
);
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: "8MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }: { metadata: any, file: any }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata?.userid);
      console.log("file url", file.ufsUrl);
      console.log("file key", file.key);
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata?.userid };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;