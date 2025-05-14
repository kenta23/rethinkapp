import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from '../../../auth';
import { cookies } from "next/headers";
import { getUserGuestSession } from "@/lib/getSession";


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
    .middleware(async () => { 
      const session = await auth();
      const getGuestUser = await getUserGuestSession();
      
      if (getGuestUser && !session?.user) { 
        if (getGuestUser.documents.length >= 1) { 
          throw new UploadThingError('You can only upload one document as guest user continue to login to upload more!');
        }
        return { userId: getGuestUser.id };
      }

      if (session?.user) { 
        return { userId: session?.user?.id };
      }

      return { userId: '' };
    })
    .onUploadComplete(async ({ metadata, file }: { metadata: { userId: string | undefined }, file: any }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata?.userId ?? 'unknown');
      console.log("file url", file.ufsUrl);
      console.log("file key", file.key);
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata?.userId };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;