#!/usr/bin/env node

const { PineconeClient } = require("@pinecone-database/pinecone");
const embeddings = require('../embeddings.json')

async function main() {
    const embedding = embeddings.find(item => item.id === 'blog-with-nextjs')?.embedding

    const pinecone = new PineconeClient();
    await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT,
        apiKey: process.env.PINECONE_API_KEY,
    });
    const indexName = process.env.PINECONE_INDEX_NAME

    const index = pinecone.Index(indexName);
    const queryRequest = {
        vector: embedding,
        topK: 10,
        includeValues: true,
        includeMetadata: true,
        namespace: process.env.PINECONE_INDEX_NAMESPACE
    };
    const queryResponse = await index.query({ queryRequest });
    console.log(queryResponse)
}

main()

