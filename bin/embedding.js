#!/usr/bin/env node

const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs').promises

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function main() {
  if (!configuration.apiKey) {
    console.error("Error: OpenAI API key not configured")
    process.exit(1)
  }

  const dirName = "content/posts/"
  const vectors = []

  for(const fileName of await fs.readdir(dirName)) {
    const path = dirName + fileName
    vectors.push(await articleToEmbedding(path))
    console.error(`pushed: ${path}`)
  }
  console.log(JSON.stringify(vectors))
}

async function articleToEmbedding(filePath) {
  const articleId = filePath.split("/").slice(-1)[0].split(".").slice(0, -1).join(".")
  const contentBuf = await fs.readFile(filePath)
  const content = contentBuf.toString("UTF-8")
  const result = await openai.createEmbedding({
    "input": content,
    "model": "text-embedding-ada-002"
  })
  const embedding = result.data.data[0].embedding
  return {
    id: articleId,
    embedding
  }
}

main()
