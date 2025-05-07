import { EmbeddingsList, Pinecone, PineconeRecord, RecordMetadata,} from '@pinecone-database/pinecone';
import { downloadFile } from './downloadFile';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Document } from '@pinecone-database/doc-splitter'
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { convertToAscii } from './convertToAscii';
import md5 from 'md5';
import { getEmbeddings } from './embeddings';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const pineconeIndex = pinecone.index("rethink-new");

const indexes = await pinecone.listIndexes();

console.log('MY INDEXES', indexes);

type DocumentPage = {
  pageContent: string;
  metadata: {
    source: string;
    pdf: { 
       version: string;
       info: Object;
       metadata: Object | null,
       totalPages: number
    }
    loc: { pageNumber: number };
    text: string;
  };
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};


export async function prepareDocument(page: DocumentPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter({
     chunkSize: 1000,
     chunkOverlap: 200
  });

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}

export async function embedDocument(doc: Document) {
  if (!doc.pageContent) {
    console.warn("No pageContent found:", doc);
    return null;
  }

  try {
    const embeddings = await getEmbeddings(doc.pageContent); // Ensure embeddings is a number array
    const hash = md5(doc.pageContent);

    console.log("EMBEDDINGS", embeddings);

    return [{
      id: hash,
      values: embeddings, // embeddings is now correctly typed as number[]
      metadata: {
        text: doc.metadata.text as string, // Ensure text is a string
        pageNumber: doc.metadata.pageNumber as number, // Ensure pageNumber is a number
      },
    }] as PineconeRecord<RecordMetadata>[];
  
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}


export async function saveVectorToPinecone(file_key: string) {
  try {
    const filePath = await downloadFile(file_key);
   //tmp/uploads/a3434dab-6c6a-480f-9bf2-948b6a3fdbd6-a8ysd4.pdf

    const loader = new PDFLoader(filePath);
    const pages = (await loader.load()) as DocumentPage[];

    // 2. split and segment the pdf
    const documents = await Promise.all(pages.map(prepareDocument)); //correct function

    // 3. vectorise and embed individual documents
    
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    // 4. upload to pinecone
    console.log("inserting vectors into pinecone");
    const newNamespace = await pineconeIndex.namespace(convertToAscii(file_key)).upsert(vectors.flat() as PineconeRecord<RecordMetadata>[]); 

    console.log('PINECONE DATA', newNamespace);
    return documents;
    
  } catch (error) {
    console.error("Error loading file to Pinecone:", error);
  }
}