"use client";
 
import { UploadButton, UploadDropzone } from "@/lib/uploadthing"; 



function formatKey(key: string) {
   return key.substring(0, key.lastIndexOf('.'));
}
export default function DropzoneUpload() {
  return (
    <main className=" ">
      <UploadDropzone
        endpoint="pdfUploader" 
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Filesfsfsfsf: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
        className=""
      />
    </main>
  );
}