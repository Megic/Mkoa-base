module.exports = function(app){
    //自动监测已经创建的entry文件夹变化，新增模块webpack/entry需重启app.js
    // if($C.controllerCache) {//监控webpack自动编译
    //
    //     var fs = require('fs');
    //     var path = require('path');
    //     var chokidar = require('chokidar');
    //     var process = require('child_process');
    //
    //     var process_c;//命令行
    //     var entrywatch;
    //     var oldArry=[];
    //     //加载Mkoa各模块下webpack目录文件
    //     function getEntryPath(){
    //         "use strict";
    //         var libArr=[];
    //         var apppath=$C.ROOT+ '/' +$C.application;
    //         var moudelList = fs.readdirSync(apppath);
    //         moudelList.forEach(function(item){
    //             if(fs.statSync(apppath + '/' + item).isDirectory()){
    //                 var mdPath=apppath + '/' + item+ '/webpack/entry/' ;//加载入口文件
    //                 if(fs.existsSync(mdPath)) libArr.push(mdPath);//监听入口文件夹
    //             }});
    //         return libArr;
    //     }
    //     //执行webpack命令
    //     function runwepack(){
    //         "use strict";
    //         console.log('执行webpack命令');
    //         if(process_c)process_c.kill();
    //         process_c=process.exec('webpack --watch', {cwd: $C.ROOT + '/' + $C.application + '/webpack'});//执行webpack
    //         process_c.stdout.on('data', function (data) {//打印webpack编译提示信息
    //             console.log(data);
    //         });
    //     }
    //     function init(){//入口文件夹变动初始化
    //         "use strict";
    //         var lock=false;
    //         var newArr=getEntryPath();
    //         if(oldArry.length!=newArr.length){
    //             oldArry=newArr;
    //             if(entrywatch)entrywatch.close();//关闭监控
    //             entrywatch=chokidar.watch(oldArry, {ignored:/\.js___jb_tmp___$/})//监控文件夹及文件新增删除,
    //                 .on('add', path => {if(lock)runwepack()})
    //                 .on('unlink', path =>{if(lock)runwepack()})
    //                 .on('ready', () =>{//初始化
    //                     runwepack();//执行webpack监控
    //                     lock=true;
    //                 });
    //         }
    //     }
    //     init();
    // }
};
