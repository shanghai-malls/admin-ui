const fs = require('fs');
const child = require('child_process');
const lessc = require('less');
const LessPluginCleanCSS = require('less-plugin-clean-css');

let promisify = (fn, receiver) => {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn.apply(receiver, [...args, (err, res) => {
                return err ? reject(err) : resolve(res);
            }]);
        });
    };
};
const exec = promisify(child.exec, child);


function processVersion(upgrade){
    let packageFile = './projects/malls-admin/core/package.json';

    let pkg = JSON.parse(fs.readFileSync(packageFile));
    let versionParts = pkg.version.split(".");
    let patchVersion = parseInt(versionParts[versionParts.length - 1]);

    versionParts[versionParts.length - 1] = upgrade? patchVersion + 1: patchVersion - 1;

    pkg.version = versionParts.join(".");

    fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2));
    if(upgrade) {
        console.log("升级版本到：" + pkg.version);
    } else {
        console.log("版本降级到：" + pkg.version);
    }
    return Promise.resolve();
}

function upgradePackage(){
    return processVersion(true);
}


function downgrade(error){
    console.log("发布失败，降级发布的npm包", error);
    return processVersion(false);
}

function processLess(){
    let data = fs.readFileSync('./projects/malls-admin/core/src/mac.less', "utf-8");

    fs.writeFileSync('../dist/malls-admin/core/malls-admin.less', data.replace("../../../../node_modules/", "../../"));

    console.log("写入less到文件：../dist/malls-admin/core/malls-admin.less");

    return writeCss(data).then(writeMinCss);
}

function writeCss(data){
    console.log("编译less代码到CSS");
    return lessc.render(data).then(({css}) => fs.writeFileSync("../dist/malls-admin/core/malls-admin.css", css))
        .then(()=>{
            console.log("编译less代码到CSS【完成】");
            return data;
        });
}

function writeMinCss(data){
    let options = {plugins : [new LessPluginCleanCSS({advanced: true})]};
    console.log("编译less代码到min css");
    return lessc.render(data, options).then(({css}) => fs.writeFileSync("../dist/malls-admin/core/malls-admin.min.css", css))
        .then(()=>{
            console.log("编译less代码到min css【完成】");
        });
}


function buildPackage(){
    console.log("开始构建npm包");
    return exec("ng build @malls-admin/core --prod").then(()=>{
        console.log("开始构建npm包【完成】");
    });
}

function publish(){
    console.log("发布npm包");
    return exec("npm publish dist/malls-admin/core").then(()=>{
        console.log("发布npm包【完成】");
    });
}


console.time("task");
Promise.resolve()
    .then(upgradePackage)
    .then(buildPackage)
    .then(processLess)
    .then(publish)
    .then(()=>{
        console.timeEnd("task");
    }).catch(downgrade)
;
