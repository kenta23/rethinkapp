import { Pinecone, PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./convertToAscii";

export type Metadata = {
    text: string;
    pageNumber: number;
};

export async function matchesEmbeddings(embeddings: number[], fileKey: string) {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
 
  // QUERYING NAMESPACE HERE
  try {
    const index = pinecone.index("rethink-new");
    const namespace = await index.namespace(convertToAscii(fileKey)).query({
      topK: 5,
      vector: embeddings,
      includeValues: true,
      includeMetadata: true,
    });

  return namespace.matches || []; //sorted by similarity

  } catch (error) {
    console.log("Something went error matching vectors", error);
    throw Error;
  }
}


export async function searchContext(q: string, fileKey: string) { 
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
 

  const index = pinecone.index("rethink-new").namespace(convertToAscii(fileKey));
  const response = await index.searchRecords({
    query: {
      topK: 2,
      inputs: { text: q },
    },
    fields: ["text"],
  });

  console.log("RESPONSE: ", response.result.hits);

  return response.result.hits;
}

export async function getContext(q: string, fileKey: string) {
  // const queryEmbeddings = await getEmbeddings(q); //convert the input string to vectors
  // const matchEmbeddingsFromDb = await matchesEmbeddings(queryEmbeddings, fileKey); 
  // //this will check the match values on your new embeddings to the vectors from pinecone db 
  // const matchedContext = matchEmbeddingsFromDb.filter(match => match.score && match.score > 0.2);

  // let docs = matchedContext.map((match) => (match?.metadata as Metadata).text);

  // console.log("DOCS: ",docs);
  
  // return docs.join("\n").substring(0, 3000);

  const searchResults = await searchContext(q, fileKey);
 
  return searchResults.filter((result) => result._score && result._score > 0.1).map((result: any) => result.fields.text).join("\n").substring(0, 3000);
}

export async function getContextForAIquestions(fileKey: string) { 
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  try {
    const index = pinecone.index("rethink-new").namespace(convertToAscii(fileKey));
    const response = await index.listPaginated();

    const queryByID = await index.query({ 
       id: response.vectors?.[0]?.id || '',
       topK: 1,
       includeValues: true,
       includeMetadata: true,
    });

    console.log("QUERY BY ID: ", queryByID);

    // Get all texts from the records
    const texts = queryByID.matches[0].metadata?.text as string;

    console.log("TEXTS: ", texts);

    if (texts.length === 0) {
      throw new Error("No records found in the namespace");
    }

    return texts;

  } catch (error) {
    console.error("Error fetching records from Pinecone:", error);
    throw error;
  }
}



