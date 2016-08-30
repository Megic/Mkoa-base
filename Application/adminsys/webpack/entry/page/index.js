require('common.css');//加载公共css
require('../../css/page/index.css');
var $C=require('$C');
window.$C.loginPath=$C.adminLoginPath;//未登录地址设置为管理登录地址
var avalon=require('avalon');
var $F=require('$F');
var $=require('$');
var $msg=require('$msg');
// var vm = avalon.define({
//     $id: "login",
//     isLogin:0,
//     lgout:$F.lgout,
//     form:{username:'',password:'',captcha:''},
//     submit:function(e){
//         e.preventDefault();
//         $F.POSTLoading($C.apiPath+'ucenter/auth/login',vm.form.$model,function(data){//获取列表数据
//             $msg.success('登录成功!');
//             setTimeout(function(){
//                 location.href=$C.$host+'workstation/index';
//             },500)
//         });
//     }
// });

$F.hideLoading();




