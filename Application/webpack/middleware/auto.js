module.exports = function(app){
    //自动监测已经创建的entry文件夹变化，为减少监听文件，新增模块webpack/entry需重启app.js
    if($C.controllerCache) {//监控webpack自动编译
        var webpack = require('webpack');
        var fs = require('fs');
        var path = require('path');
        var chokidar = require('chokidar');
        var entrywatch;
        var oldArry=[];
        //加载Mkoa各模块下webpack目录文件
        function getEntryPath(){
            "use strict";
            var libArr=[];
            var apppath=$C.ROOT+ '/' +$C.application;
            var moudelList = fs.readdirSync(apppath);
            moudelList.forEach(function(item){
                if(fs.statSync(apppath + '/' + item).isDirectory()){
                    var mdPath=apppath + '/' + item+ '/webpack/entry/' ;//加载入口文件
                    if(fs.existsSync(mdPath)) libArr.push(mdPath);//监听入口文件夹
                }});
            return libArr;
        }
        //执行webpack命令
        var baseConfig=require('../config.base.js');
        var apppath=path.normalize($C.ROOT+ '/' +$C.application);
        function runwepack(filepath){
           // if(filepath&&filepath.indexOf("\\webpack\\entry\\")>0){
             if(filepath){
               var name= filepath.toString().replace(apppath,'').replace('\\webpack\\entry','').replace('.js','');
               baseConfig.entry={};//修改入口文件
               baseConfig.entry[name]=filepath;
               console.log('开始编译：'+filepath);
               webpack(baseConfig, function(err, stats) {
                   if(err) console.log('编译错误！');
                   console.log('编译成功！')
               });
           }
        }
        function init(){//入口文件夹变动初始化
            "use strict";
            var lock=false;
            var newArr=getEntryPath();
           // var newArr=$C.ROOT+ '/' +$C.application;
            if(oldArry.length!=newArr.length){
                oldArry=newArr;
                if(entrywatch)entrywatch.close();//关闭监控
                entrywatch=chokidar.watch(oldArry, {ignored:/\.js___jb_tmp___$/})//监控文件夹及文件新增删除,
                    .on('add', path => {if(lock)runwepack(path)})
                    .on('change', path => {if(lock)runwepack(path)})
                    // .on('unlink', path =>{if(lock)runwepack(path)})
                    .on('ready', () =>{//初始化
                        console.log('webpack监听开启');
                       // runwepack();//执行webpack监控
                        lock=true;
                    });
            }
        }
        init();
    }
};
