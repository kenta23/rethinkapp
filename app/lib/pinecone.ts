import { Pinecone, PineconeRecord,} from '@pinecone-database/pinecone';
import { downloadFile } from './downloadFile';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import {  Document } from '@pinecone-database/doc-splitter'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { convertToAscii } from './convertToAscii';
import md5 from 'md5';
import { getEmbeddings } from './embeddings';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const pineconeIndex = pinecone.index("rethink");

const indexes = await pinecone.listIndexes();

console.log('MY INDEXES', indexes);

type DocumentPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};


async function prepareDocument(page: DocumentPage) {
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

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

export async function saveVectorDocx(file_key: string) {
   try {
      const filepath = await downloadFile(file_key);

      const loader = new DocxLoader(filepath);
      const pages = (await loader.load()) as DocumentPage[];
      const documents = await Promise.all(pages.map(prepareDocument));

      // 3. vectorise and embed individual documents
      const vectors = await Promise.all(documents.flat().map(embedDocument));
  
      // 4. upload to pinecone
      const namespace = pineconeIndex.namespace(convertToAscii(file_key));
  
      console.log("inserting vectors into pinecone");
      const vector = await namespace.upsert(vectors);
  
      console.log('PINECONE DATA', vector);
  
      return documents[0];
    } catch (error) {
      console.error("Error loading file to Pinecone:", error);
    }
}

export async function saveVectorToPinecone(file_key: string) {
  try {
    const filePath = await downloadFile(file_key);
  ///tmp/uploads/a3434dab-6c6a-480f-9bf2-948b6a3fdbd6-a8ysd4.docx

    const loader = new PDFLoader(filePath);
    const pages = (await loader.load()) as DocumentPage[];

    // 2. split and segment the pdf
    const documents = await Promise.all(pages.map(prepareDocument));

    // 3. vectorise and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    // 4. upload to pinecone
    const namespace = pineconeIndex.namespace(convertToAscii(file_key));

    console.log("inserting vectors into pinecone");
    const vector = await namespace.upsert(vectors);

    console.log('PINECONE DATA', vector);

    return documents[0];
  } catch (error) {
    console.error("Error loading file to Pinecone:", error);
  }
}