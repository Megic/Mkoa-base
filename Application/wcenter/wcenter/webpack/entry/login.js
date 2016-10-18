require('common.css');//加载公共css
require('../css/login.css');
var $C=require('$C');
var avalon=require('avalon');
var $F=require('$F');
var $=require('$');
var $msg=require('$msg');
var vm = avalon.define({
    $id: "login",
    isLogin:0,
    lgout:$F.lgout,
    form:{username:'',password:'',captcha:''},
    submit:function(e){
        e.preventDefault();
        $F.POSTLoading($C.apiPath+'ucenter/auth/login',vm.form.$model,function(data){//获取列表数据
            $msg.success('登录成功!');
            setTimeout(function(){//跳转地址
                location.href='/main';
            },500)
        },function(){
            $('#captcha').click();//刷新验证码
        });
    }
});

$.post($C.apiPath+'ucenter/auth/checkLogin',function(data){//检测是否登录
    if(!data.error) vm.isLogin=1;
    $F.hideLoading();
});




