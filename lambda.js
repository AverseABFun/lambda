#!/usr/bin/env node
const process = require('process');
const fs = require('fs');

if (process.argv.length<3) {
    throw new Error("Not enough arguments, expected a file path");
}
const file_path = process.argv[2];
if (!fs.existsSync(file_path)) {
    throw new Error("File does not exist");
}

function parseFile(path) {
    if (!path.endsWith(".lmd")) {
        path = path + ".lmd"
    }
    if (path == "stdlib.lmd") {
        path = process.argv[1]+"/stdlib.lmd"
    }
    if (!fs.existsSync(path)) {
        throw new Error(`Imported file ${path} does not exist`);
    }
    var file = fs.readFileSync(path).toString("utf8").split("\n");
    if (file[0].startsWith("_INCLUDES := ")) {
        var newFile = file.slice(1);
        for (var i = 0; i<file[0].replace("_INCLUDES := ", "").replaceAll(" ", "").split(","); i++) {
            var include = file[0].replace("_INCLUDES := ", "").replaceAll(" ", "").split(",")[i];
            newFile.unshift(parseFile(include))
        }
        file = newFile;
        console.log(file)
    }
    return file;
}
parseFile(file_path);