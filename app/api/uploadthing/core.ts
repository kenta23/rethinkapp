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
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await auth();
      // If you throw, the user will not be able to upload
      if (!session) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userid: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userid);
      console.log("file url", file.ufsUrl);
      console.log("file key", file.key);
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userid };
    }),

  AvatarUploader: f({
    "image": { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await auth();
      // If you throw, the user will not be able to upload
      if (!session) throw new UploadThingError("Unauthorized");

      return { userid: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userid);

      console.log("file url", file.url);
      console.log("file key", file.key);
  
      return { uploadedBy: metadata.userid };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;