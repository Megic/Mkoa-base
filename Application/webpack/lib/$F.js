//公共函数
var $msg=require('$msg');
var $C = require('$C');
var $ = require('$');//加载jquey等公用库
var errorMsg=require('error.json');
var F={};

F.hideLoading=function(domid){
    domid=domid?domid:'loading';
    var loading = document.getElementById(domid);
    loading.className='hide';
    setTimeout(function () {
        document.body.removeChild(loading);
    }, 300);
};

//延时执行函数
F.delay=function(callback,time){
    time=time?time:800;
    setTimeout(function(){callback()},time);
};
//错误信息预处理
F.preError=function(data,callback,faileBack){
    var error=data.error;
    var msg='';
    if(!error){
        callback(data.data);
    }else{
        //这里对一些特殊错误信息进行预处理
        switch (error){
            case 401://未登录,跳转到登录地址
                F.delay(function(){
                    if(parent){
                        parent.location.href = $C.loginPath;
                    }else{
                        location.href = $C.loginPath;
                    }
                });
                break;
            case 403:F.delay(function(){history.back();});//无权限
            break;
        }
            msg=errorMsg[error]?errorMsg[error]:error;
            if(msg)$msg.error(msg);//弹出错误

        if(faileBack)faileBack();
    }
};

//框架错误预处理
F.GET=function(url,data,callback,faileBack){
    $.get(url,data, function(data) {
        F.preError(data, function(data){
            if(callback)callback(data);
        },faileBack);
    });
};
//框架错误预处理
F.POST=function(url,data,callback,faileBack){
    $.post(url,data, function(data) {
        F.preError(data, function(data){
            if(callback)callback(data);
        },faileBack);
    });
};

//框架错误预处理
F.GETLoaing=function(url,data,callback,faileBack){
    $msg.loading();
    $.get(url,data, function(data) {
        $msg.closeLoading();
        F.preError(data, function(data){
            if(callback)callback(data);
        },faileBack);
    });
};
//框架错误预处理
F.POSTLoading=function(url,data,callback,faileBack){
    $msg.loading();
    $.post(url,data, function(data) {
        $msg.closeLoading();
        F.preError(data, function(data){
            if(callback)callback(data);
        },faileBack);
    });
};
//退出登录
F.lgout=function(){
    F.POSTLoading($C.apiPath+'ucenter/auth/lgout');
};
//检查是否登录返回登录用户信息
F.checkLogin=function(callback){
    F.POST($C.apiPath+'ucenter/auth/checkLogin',{},function(data){
        if(callback)callback(data);
    });
};


module.exports=F;