import { downloadFile } from '../app/lib/downloadFile';

import { prepareDocument, embedDocument, saveVectorToPinecone } from '../app/lib/pinecone'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Pinecone, PineconeRecord, RecordMetadata } from '@pinecone-database/pinecone';
import { convertToAscii } from '../app/lib/convertToAscii';


const pinecone = new Pinecone({ 
  apiKey: process.env.PINECONE_API_KEY!,
})
const pineconeIndex = pinecone.index("rethink-new");

describe("Save vector to Pinecone", () => { 
     const file_key = 'botOgo9j3m8OrAUmaFLD3Sue6M2ldYoEGxNaVj7OWKRfXtAZ';

  test ("Extract PDF file to text", async () => {
    //  const embeddedDocument = await saveVectorToPinecone(file_key);
    const filePath = await downloadFile(file_key);
    const loader = new PDFLoader(filePath);
    const pages = await loader.load();

    // 2. split and segment the pdf
    const documents = await Promise.all(pages.map(prepareDocument));

    // console.log("documents", documents);
    const vectors = await Promise.all(documents.flat().map(embedDocument));
    console.log("vectors", vectors);
   
  try {
    console.log("inserting vectors into pinecone");
    const newNamespace = await pineconeIndex.namespace(convertToAscii(file_key)).upsert(vectors.flat() as PineconeRecord<RecordMetadata>[]); 

    console.log('PINECONE DATA', newNamespace);

  } catch (error) {
    console.error("Error inserting vectors into Pinecone:", error);
  }

    // Check if the documents are loaded correctly

    expect(documents).toHaveLength(1); // Adjust this based on your expected number of documents
  })

});




