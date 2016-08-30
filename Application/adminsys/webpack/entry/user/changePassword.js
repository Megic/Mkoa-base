require('common.css');//加载公共css
require('../../css/commom.css');
require('../../css/user/changPassword.css');
var $C=require('$C');
window.$C.loginPath=$C.adminLoginPath;//未登录地址设置为管理登录地址
var avalon=require('avalon');
var $F=require('$F');
var $=require('$');
var $msg=require('$msg');
var vm=avalon.define({
    $id:'main',
    form:{
        password:'',password2:'',oldpassword:''
    },
    validate: {
       // validateInBlur:false,
        validateInKeyup:false,
        onError: function (reasons) {
            reasons.forEach(function (reason) {
                $msg.error(reason.getMessage());//验证提示
            })
        },
        onValidateAll: function (reasons) {
            if (reasons.length) {
                $msg.success('数据填写不完整!');
            } else {
                $F.POSTLoading($C.apiPath+'ucenter/admin/changePws',vm.form.$model,function(data){//获取列表数据
                    $msg.success('修改成功!');
                });
            }
        }
    }
});

$F.hideLoading();




