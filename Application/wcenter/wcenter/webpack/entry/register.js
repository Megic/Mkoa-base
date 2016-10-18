require('common.css');//加载公共css
require('../css/register.css');
var $C=require('$C');
var avalon=require('avalon');
var $F=require('$F');
var $=require('$');
var $msg=require('$msg');
var vm = avalon.define({
    $id: "login",
    isLogin:0,
    lgout:$F.lgout,
    form:{name:'',email:'',phone:'',username:'',password:'',captcha:''},
    submit:function(e){
        e.preventDefault();
        $F.POSTLoading($C.apiPath+'ucenter/auth/register',vm.form.$model,function(data){//获取列表数据
            if(!data.needCheck){
                $msg.success('注册成功!');
                setTimeout(function(){
                    location.href='main';
                },500)
            }else{
                $msg.success('注册成功!等待管理员审核。');
                setTimeout(function(){
                    location.href='login';
                },500)
            }

        },function(){
            $('#captcha').click();//刷新验证码
        });
    }
});

$F.hideLoading();




