/**
 * Created by kazaff on 2014/11/13.
 */

var crypto = require("crypto"),
    uuid = require("node-uuid");

module.exports = {
    createUniqueFileName: function(info){
        //md5(当前登录用户的数据库id + 文件原始名称 + 文件类型 + 文件最后修改时间 + 文件总大小)
        var str = "" + info.userId + info.name + info.type + info.lastModifiedDate + info.size;
        return $F.encode.md5(str);
    },
    randomFileName: function(extname){
        return uuid.v4() + "." +extname;
    }
};