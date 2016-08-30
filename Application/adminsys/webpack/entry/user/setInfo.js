require('common.css');//加载公共css
require('../../css/commom.css');
require('../../css/user/setInfo.css');
var $C=require('$C');
window.$C.loginPath=$C.adminLoginPath;//未登录地址设置为管理登录地址
var avalon=require('avalon');
var $F=require('$F');
var $=require('$');
var $msg=require('$msg');

var vm=avalon.define({
    $id:'main',
    form:{name:'',email:'',phone:'',username:''},
    validate: {
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
                $F.POSTLoading($C.apiPath+'ucenter/admin/setInfo',vm.form.$model,function(data){//获取列表数据
                    $msg.success('修改成功!');
                });
            }
        }
    }
});
avalon.validators.less1 = {
    message: '登录帐号、手机、Email不能同时为空',
    get: function (value, field, next) {
        next(vm.form.username||vm.form.phone||vm.form.email);
        return value
    }
};

$F.checkLogin(function(user){
    vm.form.name=user.name;
    vm.form.email=user.email;
    vm.form.phone=user.phone;
    vm.form.username=user.username;
    $F.hideLoading();
});



