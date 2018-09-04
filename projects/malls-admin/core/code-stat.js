const fs = require('fs');
const path = require('path');


let basePath = path.resolve('./src');

function totalLines(input) {
    let sum = 0;
    let files = fs.readdirSync(input);
    for (let file of files) {
        const childFile = path.join(input, file);
        const stats = fs.statSync(childFile);
        if(stats.isFile()) {
            let content = fs.readFileSync(childFile);
            content = content.toString('utf-8');

            sum += content.split('\n').length;
        } else if(stats.isDirectory()) {
            sum += totalLines(childFile)
        }
    }
    return sum;
}

const totalLine = totalLines(basePath);

console.log("总代码行数" + totalLine);
