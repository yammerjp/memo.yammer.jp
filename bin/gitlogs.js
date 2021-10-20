const git = require('isomorphic-git')
const path = require('path')
const fs = require('fs')

async function treeMap(basePath, treeOid, fs, dir) {
    const tree = await git.readTree({fs, dir, oid: treeOid})
    const entries = tree.tree
    const treeMapArray = await Promise.all(entries.map(async entry => {
        const entryPath = path.join(basePath, entry.path)
        if (entry.type === 'blob') {
            return [{
                'path': entryPath,
                'oid': entry.oid
            }]
        } else if (entry.type === 'tree') {
            return await treeMap(entryPath, entry.oid, fs, dir)
        } else {
            console.log(`skip submodule: ${entryPath}`)
            return []
        }
    }))
    return treeMapArray.flat()
}

async function treeKeyValue(treeOid, fs, dir) {
    const map = await treeMap('.', treeOid, fs, dir)
    const tree = {};
    map.forEach(elm => {
        tree[elm.path] = elm.oid
    })
    return tree
}

async function commitTrees() {
    const dir = process.cwd()
    const commitObjects = await git.log({fs, dir})
    const commitBlobMaps = []
    // for (c of [commitObjects[0], commitObjects[1]]) {
    for (c of commitObjects) {
        const commitBlobMap = {
            oid: c.oid,
            commit: c.commit,
            treeKeyAndValue: await treeKeyValue(c.commit.tree, fs, dir)
        }
        commitBlobMaps.push(commitBlobMap)
        console.log(c.oid)
    }
   return commitBlobMaps
}

async function main() {
    const cTrees = await commitTrees()
    const latestTree = cTrees[0].treeKeyAndValue
    const keys = Object.keys(latestTree)
    const fileHistories = keys.map(key => {
        let lastSHA = null
        let lastCTree = null
        const commitsThatMatter = []
        for (const [index, cTree] of cTrees.entries()) {
            if (cTree.treeKeyAndValue[key] != undefined) {
                if(cTree.treeKeyAndValue[key] !== lastSHA || index === cTrees.length - 1) {
                    if (lastSHA != null) commitsThatMatter.push({
                        oid: cTree.oid,
                        timestamp: cTree.commit.committer.timestamp,
                        message: cTree.commit.message
                    })
                    lastSHA = cTree.treeKeyAndValue[key]
                }
            } else {
                commitsThatMatter.push({
                    oid: lastCTree.oid,
                    timestamp: lastCTree.commit.committer.timestamp,
                    message: lastCTree.commit.message
                })
                break
            }
            lastCTree = cTree
        }
        return {
            path: key,
            history: commitsThatMatter
        }
    })
    console.log('start writing')
    await fs.promises.writeFile('gh-pages/gitlogs.json', JSON.stringify(fileHistories))
    console.log('written')
}

main()