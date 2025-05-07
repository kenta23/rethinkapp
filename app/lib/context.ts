import { Pinecone } from "@pinecone-database/pinecone";
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
      topK: 3,
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

export async function getContext(q: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(q); //convert the input string to vectors
  const matchEmbeddingsFromDb = await matchesEmbeddings(queryEmbeddings, fileKey); 
  //this will check the match values on your new embeddings to the vectors from pinecone db 
  const matchedContext = matchEmbeddingsFromDb.filter(match => match.score && match.score > 0.1);

  let docs = matchedContext.map((match) => (match?.metadata as Metadata).text);

  console.log("DOCS: ",docs);
  
  return docs.join("\n").substring(0, 3000);
}



