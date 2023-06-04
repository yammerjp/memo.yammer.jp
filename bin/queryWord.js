#!/usr/bin/env node

const { Configuration, OpenAIApi } = require("openai");
const { PineconeClient } = require("@pinecone-database/pinecone");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function main() {
    if (!configuration.apiKey) {
        console.error("Error: OpenAI API key not configured")
        process.exit(1)
    }

    const searchQueryString = "本 感想"
    const result = await openai.createEmbedding({
        "input": searchQueryString,
        "model": "text-embedding-ada-002"
    })
    const embedding = result.data.data[0].embedding

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

