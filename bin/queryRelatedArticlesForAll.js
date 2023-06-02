#!/usr/bin/env node

const { PineconeClient } = require("@pinecone-database/pinecone");
const embeddings = require('../embeddings.json')

async function main() {

    const pinecone = new PineconeClient();
    await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT,
        apiKey: process.env.PINECONE_API_KEY,
    });
    const indexName = process.env.PINECONE_INDEX_NAME

    const index = pinecone.Index(indexName);
    const relatedArticles = {}
    for(const article of embeddings) {
        const queryRequest = {
            vector: article.embedding,
            topK: 6,
            includeValues: true,
            includeMetadata: true,
            namespace: process.env.PINECONE_INDEX_NAMESPACE
        };
        const queryResponse = await index.query({ queryRequest });
        relatedArticles[article.id] = queryResponse.matches?.slice(1,5).map(item => ({id: item.id, score: item.score}))
        console.error(`finished: ${article.id}`)
    }
    console.log(JSON.stringify(relatedArticles))
}

main()

