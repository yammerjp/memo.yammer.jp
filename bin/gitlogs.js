const git = require('isomorphic-git')
const path = require('path')
const fs = require('fs')

async function tree2map(basePath, treeOid, fs, dir) {
    const treeObject = await git.readTree({fs, dir, oid: treeOid})
    const mapArr = await Promise.all(treeObject.tree.map(async entry => {
        const entryPath = path.join(basePath, entry.path)
        if (entry.type === 'blob') {
            return [{
                'path': entryPath,
                'oid': entry.oid
            }]
        } else if (entry.type === 'tree') {
            return await tree2map(entryPath, entry.oid, fs, dir)
        } else {
            console.log(`skip submodule: ${entryPath}`)
            return []
        }
    }))
    return mapArr.flat()
}

async function tree2obj(treeOid, fs, dir) {
    const map = await tree2map('.', treeOid, fs, dir)
    const obj = {};
    map.forEach(elm => {
        obj[elm.path] = elm.oid
    })
    return obj
}

async function commitsWithFiles() {
    const dir = process.cwd()
    const commitObjects = await git.log({fs, dir})
    const ret = []
    // for (c of [commitObjects[0], commitObjects[1]]) {
    for (c of commitObjects) {
        ret.push({
            oid: c.oid,
            commit: c.commit,
            files: await tree2obj(c.commit.tree, fs, dir)
        })
        console.log(c.oid)
    }
   return ret
}

async function fileHistories() {
    const commits = await commitsWithFiles()
    return Object.keys(commits[0].files).map(relativePath => {
        return {
            path: relativePath,
            history: fileHistory(relativePath, commits)
        }
    })
}

function fileHistory(key, commits) {
    let lastFileOid = commits[0].files[key];
    const history = []
    for (let i = 0; i < commits.length; i++) {
        const commit = commits[i]

        if (commit.files[key] === undefined) {
            break
        }

        if(commit.files[key] !== lastFileOid || i === commits.length - 1 || commits[i+1].files[key] === undefined) {
            history.push({
                oid: commit.oid,
                timestamp: commit.commit.committer.timestamp,
                message: commit.commit.message
            })
            lastFileOid = commit.files[key]
        }
    }
    return history
}

async function main() {
    const histories = await fileHistories()
    console.log('start writing')
    // TODO: 最新のcommit hashを含んだpathにjsonを吐き出す
    await fs.promises.writeFile('gh-pages/gitlogs.json', JSON.stringify(histories))
    console.log('written')
}

main()