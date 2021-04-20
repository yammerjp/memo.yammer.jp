#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const aws = require('aws-sdk')

const region = 'ap-northeast-1'
const bucket = 'blob.basd4g.net'

aws.config.update({region})
s3 = new aws.S3({apiVersion: '2006-03-01'})

const uploading2s3 = (filePath, key) => new Promise((resolve, reject) => {
  const fileStream = fs.createReadStream(filePath);
  fileStream.on('error', err => {
    reject(err)
  });
  const params = {
      Bucket: bucket,
      Key: key,
      Body: fileStream
   };

  s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      }
      if (data) {
        resolve(data.Location);
      }
      reject(new Error("Unknown error"));
  })
});


function uploading(filePath) {
  const time = new Date().getTime();
  const extname = path.extname(filePath);
  const key = `ms/${time}${extname}`;
  return uploading2s3(filePath, key).then(()=>key);
}

if (process.argv.length < 3) {
  console.error(`usage: node ${process.argv[1]} <uploading-file-path>`)
  process.exit(1)
}

uploading(process.argv[2]).then(key => {
 console.log('uploaded to:');
 console.log(`https://blob.basd4g.net/${key}`)
}).catch(e => {
  console.error(e);
  process.exit(1)
})
