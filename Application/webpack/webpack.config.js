// Mkoawebpack配置
var path = require("path");
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var _ = require('underscore');//辅助函数
var sConfig = require(path.join(__dirname,'../../node_modules/Mkoa/Mkoa/config'))(path.join(__dirname, '../../'));
var userConfig = require('../../config/config')(path.join(__dirname, '../../'));
_.extend(sConfig, userConfig);
var $C = sConfig;

var extractCSS = new ExtractTextPlugin('[name].css',{allChunks: true});


module.exports = {
    'entry': getFiles(), //加载入口文件
    module: {
        loaders: [//各类文件处理器
            {test: /\.js$/, loader: "babel",query: {presets: [require.resolve('babel-preset-es2015')]}},
            {test: /\.css$/, loader:extractCSS.extract("style", "css")},
            {test: /\.json$/,   loader: 'json'},
            {test: /\.html$/,   loader: 'html'},
            {test: /\.(jpg|png)$/, loader: "url?limit=8192"}
        ]
    },
    output: {
        path: $C.staticpath+$C.V,//打包输出的路径
        filename: '[name].js' //打包后的名字
        ,publicPath:$C.host+$C.V+"/"//资源文件前缀
        ,chunkFilename: "[name].chunk.js"//给require.ensure用
    },
    externals: {//一些全局引用
        "avalon": "avalon",
        "$":"jQuery",
        "webuploader":"WebUploader"
    },
    resolveLoader: {
        modulesDirectories: [
            __dirname+'/node_modules'
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js')//公共代码
        ,extractCSS//公共样式
    ],
    resolve: {
        root:  [path.join(__dirname, 'lib'),path.join(__dirname,'node_modules')]//公共库文件夹
        ,alias: {
            '$msg':'msg/index'
            ,'$V':'$V'
            ,'$router':'router/mmRouter'
            ,'$upload':'upload/index'
            ,'layer': 'layer/layer'
            ,'$F':'$F'
            ,'$pager':'pager/mkoaPager'
        }
    }
};


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