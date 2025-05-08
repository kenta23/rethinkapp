'use client'

import React from 'react'


export default function DocumentFile({ selectedFile }: { selectedFile: string | null | undefined }) {
  return (
    <div className={`w-full h-full max-h-full  relative`}>
     <iframe
        src={`https://docs.google.com/gview?url=${selectedFile}&embedded=true`} // Replace with the URL or path to your document
        title="Document Viewer"
        width="100%"
        height="100%"
        loading='lazy'
      />
  </div>
  ) 
}