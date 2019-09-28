let fs = require('fs');

function scanDir(path, recursionDepth) {
    let filesList = []
    function getFilesList(path, depth) {
        if (depth > 0) {
            let files = fs.readdirSync(path, { withFileTypes: true });
            files.forEach(function (dirent, index) {
                let fullFilePath = path + '/' + dirent.name;
                if (dirent.isDirectory()) {
                    getFilesList(fullFilePath, depth - 1);
                } else if (dirent.isFile()) {
                    let fileStat = fs.statSync(fullFilePath);
                    filesList.push({ 'created': fileStat.ctime, 'filename': fullFilePath });
                }
            });
        }
    };
    getFilesList(path, recursionDepth + 1);
    return filesList;
}

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('USAGE: program.js [path] [extension] [recursion depth = 999999] [max = 999999]');
    process.exit(0);
}

const path = args[0];
const extension = args[1];

const recursionDepth = (args.length >= 3) ? parseInt(args[2]) : 999999;
const outputLimit = (args.length >= 4) ? parseInt(args[3]) : 999999;

let filesList = scanDir(path, recursionDepth);
let filteredFileList = filesList.filter((p) => p.filename.endsWith(extension));

let maxTimeIdx = 0;
for(let i = 0 ; i < filteredFileList.length; ++i) {
    if (filteredFileList[i].created > filteredFileList[maxTimeIdx].created) {
        maxTimeIdx = i;
    }
}

let resultFileList = filteredFileList.filter(p => {return (Math.abs( (p.created.getTime() - filteredFileList[maxTimeIdx].created.getTime()) / 1000) <= 10) ? true : false });

for(let i = 0 ; i < Math.min(resultFileList.length, outputLimit) ; ++i){
    console.log(resultFileList[i].filename);
}