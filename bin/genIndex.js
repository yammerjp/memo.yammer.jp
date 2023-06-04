#!/usr/bin/env node

const { PineconeClient, utils } = require("@pinecone-database/pinecone");
const { createIndexIfNotExists } = utils;

const embeddings = require("../embeddings.json")

async function main() {
    const pinecone = new PineconeClient();
    await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT,
        apiKey: process.env.PINECONE_API_KEY,
    });
    const indexName = process.env.PINECONE_INDEX_NAME

    await createIndexIfNotExists(pinecone, indexName, 1536)

    const index = pinecone.Index(indexName);
    const upsertRequest = {
        vectors: embeddings.map(item => ({ id: item.id, values: item.embedding})),
        namespace: process.env.PINECONE_INDEX_NAMESPACE,
    };
    await index.upsert({ upsertRequest });
    console.log("finished")
}

main()
