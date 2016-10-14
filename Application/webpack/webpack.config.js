// Mkoawebpack配置
var path = require("path");
var fs = require('fs');
var _ = require('underscore');//辅助函数
var sConfig = require(path.join(__dirname,'../../node_modules/Mkoa/Mkoa/config'))(path.join(__dirname, '../../'));
var userConfig = require('../../config/config')(path.join(__dirname, '../../'));
_.extend(sConfig, userConfig);
var $C = sConfig;
var baseConfig=require('./config.base.js');
baseConfig.entry=getFiles();//修改入口文件

module.exports = baseConfig;


function getFiles(){
    //加载Mkoa各模块下webpack目录文件作为入口文件
    var libArr={};
    var apppath=$C.ROOT+ '/' +$C.application;
    function walk(apppath,callback){
        var dirList = fs.readdirSync(apppath);
        dirList.forEach(function(item){
            if(fs.statSync(apppath + '/' + item).isDirectory()){
                walk(apppath + '/' + item,callback);
            }else{
                callback(apppath  + '/' + item,item);
            }});
    }
    var moudelList = fs.readdirSync(apppath);
    moudelList.forEach(function(item){
        if(fs.statSync(apppath + '/' + item).isDirectory()){
            var mdPath=apppath + '/' + item+ '/webpack/entry/' ;//加载入口文件
            if(fs.existsSync(mdPath)) walk(mdPath,function(filePath,fileName){
                var name=filePath.replace(apppath,'').replace('/webpack/entry/','').replace('.js','');
                libArr[name]=filePath;
            });
        }});
    return libArr;
}