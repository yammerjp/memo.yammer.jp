const matter = require('gray-matter');

async function extractData(fileContents) {
  const { data } = matter(fileContents)
  const tags = (data?.tags && data.tags.length) ? data.tags : [];
  return {...data, tags}
}

const fs = require('fs/promises');
const { join } = require('path');

(async function main(){
  const dirPath = join('content', 'posts');
  const filenames = await fs.readdir(dirPath, 'utf-8');
  const articleDatas = await Promise.all(filenames.map(
    async filename => {
      const filepath = join(dirPath, filename);
      const id = filename.slice(0, filename.length -3);
      const fileStr = await fs.readFile(filepath, 'utf-8');
      const data = await extractData(fileStr);
      return {id, data};
  }));
  await fs.writeFile('gh-pages/tags/articleTags.json', JSON.stringify(articleDatas))
})()
