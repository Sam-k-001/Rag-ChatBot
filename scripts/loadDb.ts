import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const f1Data = [
  "https://en.wikipedia.org/wiki/Formula_One",
  "https://en.wikipedia.org/wiki/2024_Formula_One_World_Championship",
  "https://en.wikipedia.org/wiki/2023_Formula_One_World_Championship",
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (similarityMetric: "dot_product" | "cosine" | "euclidean" = "dot_product") => {
  try {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
      vector: {
        dimension: 1536,
        metric: similarityMetric,
      },
    });
    console.log("Collection created:", res);
  } catch (e) {
    console.log("Collection already exists or ready, proceeding...");
  }
};

const scrapePage = async (url: string) => {
  const response = await fetch(url);
  const html = await response.text();
  // Strip script, style tags and HTML markup to get clean body text
  const cleanText = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleanText;
};

const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION);

  for (const url of f1Data) {
    console.log(`Scraping: ${url}`);
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);

    console.log(`Splitted into ${chunks.length} chunks. Generating embeddings...`);

    // Only seed the first 25 chunks per page for testing speed & API token savings
    const sampleChunks = chunks.slice(0, 25);

    for (const chunk of sampleChunks) {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
        encoding_format: "float",
      });

      const vector = embedding.data[0].embedding;

      await collection.insertOne({
        $vector: vector,
        text: chunk,
      });
      console.log("Inserted chunk into Astra DB");
    }
  }
  console.log("Seeding complete!");
};

createCollection().then(() => loadSampleData());