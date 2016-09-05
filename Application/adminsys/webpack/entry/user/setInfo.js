require('common.css');//加载公共css
require('../../css/commom.css');
require('../../css/user/setInfo.css');
var $C=require('$C');
window.$C.loginPath=$C.adminLoginPath;//未登录地址设置为管理登录地址
var avalon=require('avalon');
var $F=require('$F');
var $=require('$');
var $msg=require('$msg');
var $upload=require('$upload');


$F.checkLogin(function(user){//检查登录

    var vm=avalon.define({
        $id:'main',
        form:{name:'',email:'',phone:'',username:'',headimgurl:''},
        validate: {//数据验证
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
        },
        getImage:function(){//上传图片
            //type:0[默认] 弹出上传文件、图片列表 1只显示图片类别  2只显示文件列表  userInfo分片上传参数
            $upload.open({type:1,userInfo:{userId:user.id, md5:""}},function(url){
                console.log(url)
                vm.form.headimgurl=url;
            });
        },
        getImageHtml:function(){//返回头像html
            var html='';
           if(vm.form.headimgurl)html=`<img width="100"  src="${$C.imagePath}${vm.form.headimgurl}" />`;
            return html;

        }
    });
    //过滤方法
    avalon.validators.less1 = {
        message: '登录帐号、手机、Email不能同时为空',
        get: function (value, field, next) {
            next(vm.form.username||vm.form.phone||vm.form.email);
            return value
        }
    };
    
    vm.form.name=user.name;
    vm.form.email=user.email;
    vm.form.phone=user.phone;
    vm.form.username=user.username;
    vm.form.headimgurl=user.headimgurl;
    avalon.scan(document.body);
    $F.hideLoading();
});



