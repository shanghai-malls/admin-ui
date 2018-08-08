const fs = require('fs');


let data = fs.readFileSync('./src/styles.less');
data = data.toString().replace("../node_modules/", "../../");

fs.writeFile('./dist/malls-admin/core/malls-admin.less', data, function(error){
    if(error) {
        return console.error(error);
    }
    console.log("文件写入成功");
});

